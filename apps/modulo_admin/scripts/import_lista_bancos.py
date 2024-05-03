import openpyxl
from django.utils import timezone
from apps.modulo_admin.models import InstituicoesFinanceiras

def import_from_excel(file_path):
    workbook = openpyxl.load_workbook(file_path)
    sheet = workbook.active

    for row in sheet.iter_rows(min_row=2, values_only=True): 
        bancos = InstituicoesFinanceiras()
        bancos.codigo = row[0]
        bancos.ispb = row[1]
        bancos.nome = row[2]
        bancos.ord = row[3]
        bancos.save()

def run():
    # Caminho do arquivo que você quer importar
    #file_path = r"C:\Users\alan.ribeiro\Desktop\SisDAF\dados\lista_uf_municipio.xlsx"
    file_path = 'dados/lista_bancos.xlsx'
    import_from_excel(file_path)


#python manage.py runscript apps.modulo_admin.scripts.import_lista_bancos