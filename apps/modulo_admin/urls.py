from django.urls import path
from apps.modulo_admin.views import (login_admin, cadastro_usuario, 
                                     municipios_uf_json, novo_cnabr, procurar_cnabr,
                                     consultar_cnpj,
                                     relatorio_tecnico)

urlpatterns = [
    path('administrador/', login_admin, name='login_admin'),

    path('cna-br/novo-cadastro/', novo_cnabr, name='novo_cnabr'),
    path('procurar_cnabr/<str:cpf>/', procurar_cnabr, name='procurar_cnabr'),

    path('cadastro/', cadastro_usuario, name='cadastro_usuario'),
    path('municipios-uf-json/<str:uf>/', municipios_uf_json, name='municipios_uf_json'),

    path('relatorio-atendimento/<int:id>/', relatorio_tecnico, name='relatorio_tecnico'),

    path('consultarcnpj/<str:cnpj>/', consultar_cnpj, name='consultar_cnpj')
]