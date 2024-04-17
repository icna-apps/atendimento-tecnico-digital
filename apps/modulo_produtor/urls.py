from django.urls import path
from apps.modulo_produtor.views import (login_produtor,
                                        produtor_meus_atendimentos_lista,
                                        produtor_novo_atendimento, 
                                        produtor_meus_dados,
                                        produtor_informacoes)

urlpatterns = [
    path('', login_produtor, name='login_produtor'),


    path('produtor/meus-atendimentos/', produtor_meus_atendimentos_lista, name='produtor_meus_atendimentos_lista'),
    path('produtor/novo-atendimento/', produtor_novo_atendimento, name='produtor_novo_atendimento'),

    path('produtor/meus-dados/', produtor_meus_dados, name='produtor_meus_dados'),
    path('produtor/informacoes/', produtor_informacoes, name='produtor_informacoes'),
]