from typing import List
from interface import implements
from UseCases.IMAGE.Interfaces.IImageParserService import IImageParserService
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

class ImageParserService(implements(IImageParserService)):
    def __init__(self, config):
        pass

    def download_image_to_tempdir(self, url, filename=None):
        if filename is None:
            filename = os.path.basename(url)
        response = requests.get(url, stream=True)
        tempdir = table_ocr.util.make_tempdir("demo")
        filepath = os.path.join(tempdir, filename)
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content():
                f.write(chunk)
        return filepath

    def get_data(self, data: ParseDto) -> ResultTablesDto:
        
        if data.url is not None:
            website_is_up = False
            try:
                status_code = urllib.request.urlopen(data.url).getcode()
                website_is_up = status_code == 200
            except:
                pass
            image_filepath = website_is_up == True and self.download_image_to_tempdir(data.url) or data.url

            image_tables  = table_ocr.extract_tables.main([image_filepath])
            for image, tables in image_tables :
                list = []
                for table in tables:
                    cells = table_ocr.extract_cells.main(table)
                    ocr = [
                        table_ocr.ocr_image.main(cell, None)
                        for cell in cells
                    ]
                    
                    csv = table_ocr.ocr_to_csv.text_files_to_csv(ocr)
                    df = pd.read_csv(StringIO(csv), sep=",")
                    df = df.replace(r'\r+|\n+|\t+|\/+',' ', regex=True)
                    df = df.replace(r'\s+',' ', regex=True)
                    df = df.dropna(axis=1, how='all')
                    df = df.replace(np.nan, '-', regex=True)
                    json = df.to_dict("records")
                    list.append(json)

                return ResultTablesDto(list)

            try:
                shutil.rmtree("/home/user/Sorge/Sorge/ApplicationService/Files/test")
            except:
                pass

        return ResultTablesDto([])
