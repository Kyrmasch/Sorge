from typing import List
from interface import implements
from UseCases.Pictures.Interfaces.IImageParserService import IImageParserService
from ApplicationService.Dtos.ParseDto import ParseDto
from ApplicationService.Dtos.ResultTablesDto import ResultTablesDto
import pandas as pd
import os
import numpy as np
import table_ocr.util
import table_ocr.extract_tables
import table_ocr.extract_cells
import table_ocr.ocr_image
import table_ocr.ocr_to_csv
import requests
import cv2
import urllib
import shutil
from io import StringIO
import pytesseract
import os.path
from ApplicationService.DepentencyInjection import table as Atable
from Infrastructure.DepentencyInjection import mediatr
from UseCases.Commands.SetProgressCommanddHandler import ProgressCommand


class ImageParserService(implements(IImageParserService)):
    def __init__(self, config):
        pass

    def sort_contours(self, cnts, method="left-to-right"):
        reverse = False
        i = 0
        if method == "right-to-left" or method == "bottom-to-top":
            reverse = True
        if method == "top-to-bottom" or method == "bottom-to-top":
            i = 1
        boundingBoxes = [cv2.boundingRect(c) for c in cnts]
        (cnts, boundingBoxes) = zip(
            *sorted(zip(cnts, boundingBoxes), key=lambda b: b[1][i], reverse=reverse)
        )
        return (cnts, boundingBoxes)

    def download_image_to_tempdir(self, url, filename=None):
        if filename is None:
            filename = os.path.basename(url)
        headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
        }

        response = requests.get(url, stream=True, headers=headers)
        tempdir = table_ocr.util.make_tempdir("demo")
        filepath = os.path.join(tempdir, filename)
        with open(filepath, "wb") as f:
            for chunk in response.iter_content():
                f.write(chunk)
        return filepath

    def get_data_cv(self, data: ParseDto) -> ResultTablesDto:
        if data.url is not None:
            website_is_up = False
            Rlist = []
            cores = []
            guids = []

            try:
                status_code = urllib.request.urlopen(data.url).getcode()
                website_is_up = status_code == 200
            except:
                pass

            mediatr.send(ProgressCommand(10, "Загрузка изображения по ссылке"))

            image_filepath = (
                website_is_up == True
                and self.download_image_to_tempdir(data.url)
                or data.url
            )

            if os.path.isfile(image_filepath):

                mediatr.send(ProgressCommand(30, "Обработка изображения OpenCV"))

                img = cv2.imread(image_filepath,0)
                img.shape

                thresh,img_bin = cv2.threshold(img,128,255,cv2.THRESH_BINARY | cv2.THRESH_OTSU)
                img_bin = 255-img_bin
                kernel_len = np.array(img).shape[1]//100
                ver_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, kernel_len))
                hor_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_len, 1))
                kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))

                image_1 = cv2.erode(img_bin, ver_kernel, iterations=3)
                vertical_lines = cv2.dilate(image_1, ver_kernel, iterations=3)

                image_2 = cv2.erode(img_bin, hor_kernel, iterations=3)
                horizontal_lines = cv2.dilate(image_2, hor_kernel, iterations=3)

                img_vh = cv2.addWeighted(vertical_lines, 0.5, horizontal_lines, 0.5, 0.0)
                img_vh = cv2.erode(~img_vh, kernel, iterations=2)
                thresh, img_vh = cv2.threshold(img_vh,128,255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
                bitxor = cv2.bitwise_xor(img,img_vh)
                bitnot = cv2.bitwise_not(bitxor)

                mediatr.send(ProgressCommand(50, "Поиск контуров таблиц на изображении"))

                contours, hierarchy = cv2.findContours(img_vh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
                contours, boundingBoxes = self.sort_contours(contours, method="top-to-bottom")

                heights = [boundingBoxes[i][3] for i in range(len(boundingBoxes))]
                mean = np.mean(heights)

                box = []
                for c in contours:
                    x, y, w, h = cv2.boundingRect(c)
                    if (w<1000 and h<500):
                        image = cv2.rectangle(img,(x,y),(x+w,y+h),(0,255,0),2)
                        box.append([x,y,w,h])
                        
                row=[]
                column=[]
                j=0

                for i in range(len(box)):    
                    if(i==0):
                        column.append(box[i])
                        previous=box[i]    
                    
                    else:
                        if(box[i][1]<=previous[1]+mean/2):
                            column.append(box[i])
                            previous=box[i]            
                            
                            if(i==len(box)-1):
                                row.append(column)        
                            
                        else:
                            row.append(column)
                            column=[]
                            previous = box[i]
                            column.append(box[i])
                            
                countcol = 0
                for i in range(len(row)):
                    countcol = len(row[i])
                    if countcol > countcol:
                        countcol = countcol

                center = [int(row[i][j][0]+row[i][j][2]/2) for j in range(len(row[i])) if row[0]]

                center=np.array(center)
                center.sort()

                finalboxes = []
                for i in range(len(row)):
                    lis=[]
                    for k in range(countcol):
                        lis.append([])
                    for j in range(len(row[i])):
                        diff = abs(center-(row[i][j][0]+row[i][j][2]/4))
                        minimum = min(diff)
                        indexing = list(diff).index(minimum)
                        lis[indexing].append(row[i][j])
                    finalboxes.append(lis)

                mediatr.send(ProgressCommand(70, "Сортировка позиций найденных ячеек таблиц и распознание текста"))

                outer=[]
                for i in range(len(finalboxes)):
                    for j in range(len(finalboxes[i])):
                        inner=''
                        if(len(finalboxes[i][j])==0):
                            outer.append(' ')
                        else:
                            for k in range(len(finalboxes[i][j])):
                                y,x,w,h = finalboxes[i][j][k][0],finalboxes[i][j][k][1], finalboxes[i][j][k][2],finalboxes[i][j][k][3]
                                finalimg = bitnot[x:x+h, y:y+w]
                                kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 1))
                                border = cv2.copyMakeBorder(finalimg,2,2,2,2, cv2.BORDER_CONSTANT,value=[255,255])
                                resizing = cv2.resize(border, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
                                dilation = cv2.dilate(resizing, kernel,iterations=1)
                                erosion = cv2.erode(dilation, kernel,iterations=2)
                                
                                out = pytesseract.image_to_string(erosion, lang='eng+rus')
                                if(len(out)==0):
                                    out = pytesseract.image_to_string(erosion, config='--psm 3', lang='eng+rus')
                                inner = inner +" "+ out
                            outer.append(inner)

                mediatr.send(ProgressCommand(90, "Форматирование таблицы"))

                arr = np.array(outer)
                dataframe = pd.DataFrame(arr.reshape(len(row), countcol))
                dataframe = Atable.aks(dataframe)
                core, dataframe = Atable.getCoreColumn(dataframe)
                if (core is not None):
                    cores.append(core)

                save, sha = Atable.save_json(dataframe, core)
                if sha is not None and save == True:
                    guids.append(sha)
                json = dataframe.to_dict("records")
                Rlist.append(json)

                Tresult = ResultTablesDto(Rlist, cores, guids)

                return Tresult


        return ResultTablesDto([])

    def get_data(self, data: ParseDto) -> ResultTablesDto:

        if data.url is not None:
            website_is_up = False
            try:
                status_code = urllib.request.urlopen(data.url).getcode()
                website_is_up = status_code == 200
            except:
                pass
            image_filepath = (
                website_is_up == True
                and self.download_image_to_tempdir(data.url)
                or data.url
            )

            image_tables = table_ocr.extract_tables.main([image_filepath])
            for image, tables in image_tables:
                
                list = []
                cores = []
                guids = []

                for table in tables:
                    cells = table_ocr.extract_cells.main(table)
                    ocr = [table_ocr.ocr_image.main(cell, None) for cell in cells]

                    csv = table_ocr.ocr_to_csv.text_files_to_csv(ocr)
                    df = pd.read_csv(StringIO(csv), sep=",")

                    df = Atable.aks(df)  
                    core, df = Atable.getCoreColumn(df)
                    if core is not None:
                        cores.append(core)

                    save, sha = Atable.save_json(df, core)
                    if sha is not None and save == True:
                        guids.append(sha)

                    json = df.to_dict("records")
                    list.append(json)

                return ResultTablesDto(list, cores, guids)

            try:
                shutil.rmtree("/home/user/Sorge/Sorge/ApplicationService/Files/test")
            except:
                pass

        return ResultTablesDto([])
