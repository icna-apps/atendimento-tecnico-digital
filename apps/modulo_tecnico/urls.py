from django.urls import path
from apps.modulo_tecnico.views import (login_tecnico, tecnico_dashboard, 
                                       tecnico_atendimentos,
                                       logout_tecnico, 
                                       tecnico_meus_dados, tecnico_ficha_atendimento,
                                       tecnico_atendimento_salvar_relatorio, tecnico_confirmar_atendimento,
                                       tecnico_meus_horarios, tecnico_meus_horarios_salvar)

urlpatterns = [
    path('tecnico/', login_tecnico, name='login_tecnico'),
    path('logout/', logout_tecnico, name='logout'),
   

    path('tecnico/dashboard/', tecnico_dashboard, name='tecnico_dashboard'),

    path('tecnico/atendimentos/', tecnico_atendimentos, name='tecnico_atendimentos'),
    path('tecnico/atendimentos/atendimento/<int:id>/', tecnico_ficha_atendimento, name='tecnico_ficha_atendimento'),
    path('tecnico/atendimentos/atendimento/salvar-relatorio/<int:id>/', tecnico_atendimento_salvar_relatorio, name='tecnico_atendimento_salvar_relatorio'),
    path('tecnico/atendimentos/atendimento/confirmar-atendimento/<int:id>/', tecnico_confirmar_atendimento, name='tecnico_confirmar_atendimento'),

    path('tecnico/meushorarios/', tecnico_meus_horarios, name='tecnico_meushorarios'),
    path('tecnico/meushorarios/salvar/', tecnico_meus_horarios_salvar, name='tecnico_meus_horarios_salvar'),

    path('tecnico/meus-dados/', tecnico_meus_dados, name='tecnico_meus_dados'),
]