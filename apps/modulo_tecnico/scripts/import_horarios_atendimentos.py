import openpyxl
from django.utils import timezone
from apps.modulo_tecnico.models import HorariosAtendimentos
from apps.modulo_admin.models import Usuario

def import_from_excel(file_path, user_id):
    usuario = Usuario.objects.get(id=user_id)
    workbook = openpyxl.load_workbook(file_path)
    sheet = workbook.active
    horarios = []

    for row in sheet.iter_rows(min_row=2, values_only=True):
        horario = HorariosAtendimentos(
            data_ultima_atualizacao=timezone.now(),
            responsavel_atualizacao=usuario,
            regional=row[0],
            dia_semana=row[1],
            horario=row[2],
            tecnico=None
        )
        horarios.append(horario)
    
    # Usar bulk_create para melhor performance
    HorariosAtendimentos.objects.bulk_create(horarios)

def run():
    file_path = 'dados/lista_horarios_atendimentos.xlsx'
    user_id = 1 
    import_from_excel(file_path, user_id)

#python manage.py runscript apps.modulo_tecnico.scripts.import_horarios_atendimentos