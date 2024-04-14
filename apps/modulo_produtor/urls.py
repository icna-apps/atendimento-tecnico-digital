from django.urls import path
from apps.modulo_produtor.views import login_produtor, produtor_meus_atendimentos_lista

urlpatterns = [
    path('', login_produtor, name='login_produtor'),
    path('produtor/meus-atendimentos/', produtor_meus_atendimentos_lista, name='produtor_meus_atendimentos_lista'),
    
]