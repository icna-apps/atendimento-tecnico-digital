from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.http import JsonResponse
from apps.modulo_admin.forms import CadastroForm, LoginForm
from apps.modulo_admin.models import UF_Municipio, Usuario
from django.db import transaction

def login_admin(request):
    pass

def cadastro_usuario(request):
    lista_ufs = UF_Municipio.objects.values_list('uf_sigla', flat=True).order_by('uf_sigla').distinct()
    conteudo = {
        'form_cadastro': CadastroForm(),
        'form_login': LoginForm(),
        'lista_ufs': lista_ufs,
    }
    return render(request, 'modulo_admin/cadastro.html', conteudo)

def municipios_uf_json(request, uf=None):
    lista_municipios = UF_Municipio.objects.filter(uf_sigla=uf).values_list('municipio', flat=True).order_by('municipio')
    municipios = list(lista_municipios.values('cod_ibge', 'municipio'))
    return JsonResponse({'municipios': municipios})

def novo_cnabr(request):
    if request.method == 'POST':
        form = CadastroForm(request.POST)
        print(form)
        #Validações
        if form.is_valid():
            #senha criptografada
            senha = form.cleaned_data["senha1"]
            hashed_password = make_password(senha)

            #outros campos
            
            cpf=form.cleaned_data['cpf']
            nome_completo=form.cleaned_data['nome_completo']
            sexo=form.cleaned_data['sexo']
            data_nascimento=form.cleaned_data['data_nascimento']
            reside_cod_ibge=form.cleaned_data['cod_ibge']
            celular=form.cleaned_data['celular']
            email_pessoal=form.cleaned_data['email']

            with transaction.atomic():
                #tabela auth_user
                auth_usuario = User.objects.create(
                    username=cpf,
                    first_name=nome_completo,
                    last_name=celular,
                    email=email_pessoal,
                    password=hashed_password
                )

                #tabela cna.br
                Usuario.objects.create(
                    user=auth_usuario,
                    cpf=cpf,
                    nome_completo=nome_completo,
                    sexo=sexo,
                    data_nascimento=data_nascimento,
                    reside_cod_ibge=reside_cod_ibge,
                    celular=celular,
                    email_pessoal=email_pessoal,
                )

            return JsonResponse({'retorno': 'sucesso'})
    print('Form é INválido')
    print(form.errors)
    return JsonResponse({'retorno': 'cadastro não realizado'})

def procurar_cnabr(request, cpf=None):
    try:
        usuario = Usuario.objects.get(cpf=cpf)
        usuario_existe = True
    except Usuario.DoesNotExist:
        usuario_existe = False
    print('Usuário existe? ', usuario_existe)
    return JsonResponse({'usuario': usuario_existe})