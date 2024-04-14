from django.contrib import admin
from apps.modulo_tecnico.models import HorariosAtendimentos

class ListandoHorarios(admin.ModelAdmin):
    list_display = ("regional", "dia_semana", "horario", "tecnico")
    list_display_links = ("regional", "dia_semana", "horario", "tecnico")
    list_filter = ("regional", "dia_semana", "horario", "tecnico")
    list_per_page = 100



admin.site.register(HorariosAtendimentos, ListandoHorarios)