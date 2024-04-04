from django.urls import path
from apps.modulo_tecnico.views import login_tecnico, dashboard

urlpatterns = [
    path('', login_tecnico, name='login_tecnico'),

   

    path('dashboard/', dashboard, name='dashboard'),
]