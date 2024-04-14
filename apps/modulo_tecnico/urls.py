from django.urls import path
from apps.modulo_tecnico.views import login_tecnico, dashboard, logout_tecnico, meus_horarios, meus_horarios_salvar

urlpatterns = [
    path('tecnico/', login_tecnico, name='login_tecnico'),
    path('logout/', logout_tecnico, name='logout'),
   

    path('dashboard/', dashboard, name='dashboard'),

    path('meushorarios/', meus_horarios, name='meushorarios'),
    path('meushorarios/salvar/', meus_horarios_salvar, name='meus_horarios_salvar'),
]