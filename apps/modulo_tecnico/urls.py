from django.urls import path
from apps.modulo_tecnico.views import (login_tecnico, tecnico_dashboard, 
                                       tecnico_atendimentos,
                                       logout_tecnico, 
                                       tecnico_meus_dados, tecnico_ficha_atendimento,
                                       tecnico_atendimento_salvar_relatorio, tecnico_confirmar_atendimento,
                                       tecnico_cancelar_atendimento, tecnico_agendar_retorno, tecnico_finalizar_atendimento,
                                       tecnico_pagamentos, tecnico_filtro_atendimento,
                                       tecnico_meusdados_atualizar,
                                       tecnico_meus_horarios, tecnico_meus_horarios_salvar,
                                       tecnico_meusdados_especialidades)

urlpatterns = [
    path('tecnico/', login_tecnico, name='login_tecnico'),
    path('logout/', logout_tecnico, name='logout'),
   

    path('tecnico/dashboard/', tecnico_dashboard, name='tecnico_dashboard'),

    path('tecnico/atendimentos/', tecnico_atendimentos, name='tecnico_atendimentos'),
    path('tecnico/atendimentos/atendimento/<int:id>/', tecnico_ficha_atendimento, name='tecnico_ficha_atendimento'),
    path('tecnico/atendimentos/atendimento/salvar-relatorio/<int:id>/', tecnico_atendimento_salvar_relatorio, name='tecnico_atendimento_salvar_relatorio'),
    path('tecnico/atendimentos/atendimento/confirmar-atendimento/<int:id>/', tecnico_confirmar_atendimento, name='tecnico_confirmar_atendimento'),
    path('tecnico/atendimentos/atendimento/cancelar-atendimento/<int:id>/', tecnico_cancelar_atendimento, name='tecnico_cancelar_atendimento'),
    path('tecnico/atendimentos/atendimento/agendar-retorno/<int:id>/', tecnico_agendar_retorno, name='tecnico_agendar_retorno'),
    path('tecnico/atendimentos/atendimento/finalizar/<int:id>/', tecnico_finalizar_atendimento, name='tecnico_finalizar_atendimento'),
    path('tecnico/atendimentos/filtro/', tecnico_filtro_atendimento, name='tecnico_filtro_atendimento'),

    path('tecnico/meushorarios/', tecnico_meus_horarios, name='tecnico_meushorarios'),
    path('tecnico/meushorarios/salvar/', tecnico_meus_horarios_salvar, name='tecnico_meus_horarios_salvar'),

    path('tecnico/pagamentos/', tecnico_pagamentos, name='tecnico_pagamentos'),

    path('tecnico/meus-dados/', tecnico_meus_dados, name='tecnico_meus_dados'),
    path('tecnico/meusdados/atualizar/', tecnico_meusdados_atualizar, name='tecnico_meusdados_atualizar'),
    path('tecnico/meusdados/especialidades/', tecnico_meusdados_especialidades, name='tecnico_meusdados_especialidades')
]