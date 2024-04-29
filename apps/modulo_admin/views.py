import os
from django.utils.timezone import now
from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.template.loader import get_template
import pdfkit
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.http import JsonResponse
from apps.modulo_admin.forms import CadastroForm, LoginForm
from apps.modulo_admin.models import UF_Municipio, Usuario, Atendimento
from django.db import transaction
import base64

def image_to_base64(image_path):
    full_path = os.path.join(settings.BASE_DIR, 'setup', 'static', image_path)
    print('FULL PATH: ', full_path)
    with open(full_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


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


def relatorio_tecnico(request, id):

    #Atendimento
    atendimento = Atendimento.objects.get(id=id)
    logo_base64 = image_to_base64('assets/logos/logo_cna.jpg')
    
    #log do relatório
    data_relatorio = now()
    usuario = request.user.usuario_relacionado.primeiro_ultimo_nome()

    conteudo = {
        'titulo': 'Relatório do Atendimento Técnico Digital',
        'atendimento': atendimento,
        'logo': logo_base64,
        'data_relatorio': data_relatorio,
        'usuario': usuario,
    }

    template_path = 'modulo_admin/relatorio_atendimento.html'
    template = get_template(template_path)
    html = template.render(conteudo)
    # html = render_to_string('modulo_admin/relatorio_atendimento.html', conteudo, request)

    
    # Verificar se está rodando no Heroku ou localmente
    if 'DATABASE_URL' in os.environ:
        # Caminho para o Heroku
        path_wkhtmltopdf = '/app/bin/wkhtmltopdf'
    else:
        # Caminho para o ambiente local (Windows)
        path_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
    
    # Especificar o caminho diretamente
    config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)

    options = {
        'page-size': 'A4',
        'margin-top': '0.75in',
        'margin-right': '0.75in',
        'margin-bottom': '0.75in',
        'margin-left': '0.75in',
        'encoding': "UTF-8",
        'custom-header' : [
            ('Accept-Encoding', 'gzip')
        ],
        'enable-local-file-access': '',
        'no-outline': None,
        'log-level': 'error'  # Configura o nível de log para 'error', reduzindo a quantidade de logs
    }
    
    # pdf = pdfkit.from_string(html, False, configuration=config)
    pdf = pdfkit.from_string(html, False, options=options, configuration=config)

    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="relatorio_tecnico.pdf"'
    if response.status_code != 200:
        return HttpResponse('We had some errors <pre>' + html + '</pre>')
    return response

