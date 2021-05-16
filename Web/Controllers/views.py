from flask import request, render_template, current_app

from UseCases.parcer import ParcerProvider
from Infrastruction.dbcontext import DbProvider

parcer = ParcerProvider({})
db = DbProvider({})

def index():
    tables = parcer.get_data("https://aeroport.kz/online.php?param=KGF|1")
    return render_template(
        'index.html'
    )

def settings():
    return render_template(
        'settings.html'
    )