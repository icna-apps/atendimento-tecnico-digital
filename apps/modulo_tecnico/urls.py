from django.urls import path
from apps.modulo_tecnico.views import (login_tecnico, dashboard, 
                                       atendimentos,
                                       logout_tecnico, 
                                       tecnico_meus_dados,
                                       meus_horarios, meus_horarios_salvar)

urlpatterns = [
    path('tecnico/', login_tecnico, name='login_tecnico'),
    path('logout/', logout_tecnico, name='logout'),
   

    path('dashboard/', dashboard, name='dashboard'),

    path('atendimentos/', atendimentos, name='atendimentos'),

    path('tecnico/meus-dados/', tecnico_meus_dados, name='tecnico_meus_dados'),

    path('meushorarios/', meus_horarios, name='meushorarios'),
    path('meushorarios/salvar/', meus_horarios_salvar, name='meus_horarios_salvar'),
]