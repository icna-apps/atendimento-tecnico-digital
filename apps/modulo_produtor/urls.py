from django.urls import path
from apps.modulo_produtor.views import (login_produtor,
                                        produtor_meus_atendimentos_lista,
                                        produtor_novo_atendimento, produtor_realizar_agendamento,
                                        produtor_confirmacao_atendimento, produtor_ficha_atendimento,
                                        produtor_meus_dados,
                                        produtor_informacoes)

urlpatterns = [
    path('', login_produtor, name='login_produtor'),


    path('produtor/meus-atendimentos/', produtor_meus_atendimentos_lista, name='produtor_meus_atendimentos_lista'),
    path('produtor/novo-atendimento/', produtor_novo_atendimento, name='produtor_novo_atendimento'),
    path('produtor/realizar-agendamento/', produtor_realizar_agendamento, name='produtor_realizar_agendamento'),
    path('produtor/confirmacao-atendimento/<int:id>/', produtor_confirmacao_atendimento, name='produtor_confirmacao_atendimento'),
    path('produtor/ficha-atendimento/<int:id>/', produtor_ficha_atendimento, name='produtor_ficha_atendimento'),

    path('produtor/meus-dados/', produtor_meus_dados, name='produtor_meus_dados'),
    path('produtor/informacoes/', produtor_informacoes, name='produtor_informacoes'),
]