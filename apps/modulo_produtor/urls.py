from django.urls import path
from apps.modulo_produtor.views import (login_produtor,
                                        produtor_meus_atendimentos_lista,
                                        produtor_novo_atendimento, produtor_realizar_agendamento,
                                        produtor_confirmacao_atendimento, produtor_ficha_atendimento,
                                        produtor_cancelar_atendimento, produtor_avaliar_atendimento,
                                        produtor_meus_dados, produtor_meus_dados_alterar,
                                        produtor_informacoes,
                                        produtor_novo_atendimento_datas_horas)

urlpatterns = [
    path('', login_produtor, name='login_produtor'),

    #Atendimentos
    path('produtor/meus-atendimentos/', produtor_meus_atendimentos_lista, name='produtor_meus_atendimentos_lista'),
    path('produtor/novo-atendimento/', produtor_novo_atendimento, name='produtor_novo_atendimento'),
    path('produtor/datas-horarios/<str:atividade_produtiva>/', produtor_novo_atendimento_datas_horas, name='produtor_novo_atendimento_datas_horas'),
    path('produtor/realizar-agendamento/', produtor_realizar_agendamento, name='produtor_realizar_agendamento'),
    path('produtor/confirmacao-atendimento/<int:id>/', produtor_confirmacao_atendimento, name='produtor_confirmacao_atendimento'),
    path('produtor/ficha-atendimento/<int:id>/', produtor_ficha_atendimento, name='produtor_ficha_atendimento'),
    path('produtor/ficha-atendimento/cancelar/<int:id>/', produtor_cancelar_atendimento, name='produtor_cancelar_atendimento'),
    path('produtor/ficha-atendimento/avaliar/<int:id>/<int:nota>/', produtor_avaliar_atendimento, name='produtor_avaliar_atendimento'),

    #Meus Dados
    path('produtor/meus-dados/', produtor_meus_dados, name='produtor_meus_dados'),
    path('produtor/meus-dados/alterar/', produtor_meus_dados_alterar, name='produtor_meus_dados_alterar'),


    path('produtor/informacoes/', produtor_informacoes, name='produtor_informacoes'),
]