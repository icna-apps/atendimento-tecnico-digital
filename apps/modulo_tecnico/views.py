from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.contrib.auth import logout
from django.contrib.auth.models import User
from django.contrib import auth
from apps.modulo_admin.forms import LoginForm
from apps.modulo_admin.models import Usuario, Atendimento
from apps.modulo_tecnico.models import HorariosAtendimentos
import json
import logging

logger = logging.getLogger(__name__)


def login_tecnico(request):    
    
    form = LoginForm(request.POST or None)

    if request.method == 'POST' and form.is_valid():
        cpf = form.cleaned_data['cpf']
        senha = form.cleaned_data['senha']

        usuario = auth.authenticate(request, username=cpf, password=senha)
        
        if not usuario:
            mensagem_erro = "Usuário ou senha inválido!"
        else:
            usuario_validacao = usuario.usuario_relacionado
            
            #Verificações
            if not usuario_validacao.usuario_is_ativo or usuario_validacao.del_status:
                mensagem_erro = "Usuário Inativado!"
            elif not usuario_validacao.vinculo_regional_ativo():
                mensagem_erro = "Cadastro Em Análise!"
            else:
                # Todas as verificações passaram, então podemos logar o usuário
                auth.login(request, usuario)
                return redirect('dashboard')
        
        # Se qualquer uma das verificações falhar, setar o valor inicial de 'cpf' e renderizar novamente
        form.fields['cpf'].initial = cpf
        conteudo = {
            'form': form,
            'mensagem': mensagem_erro
        }
        return render(request, 'modulo_tecnico/login.html', conteudo)

    legenda = {
        'titulo': 'Luana e Cléber - DATeG Senar - Administração Central',
        'data': '07 de fevereiro de 2023',
        'fotografo': 'Fotográfo: Wenderson Araújo/Trilux'
    }

    conteudo = {
        'legenda': legenda,
        'form': form,
    }
    logout(request)
    return render(request, 'modulo_tecnico/login.html', conteudo)



def dashboard(request):
    return render(request, 'modulo_tecnico/dashboard.html')


def atendimentos(request):

    tecnico = request.user.usuario_relacionado
    atendimentos = Atendimento.objects.filter(tecnico=tecnico).order_by('-id')

    conteudo = {
        'atendimentos': atendimentos,
    }

    return render(request, 'modulo_tecnico/lista_atendimentos.html', conteudo)


def meus_horarios(request):

    regional = request.user.usuario_relacionado.regional_senar()

    horarios = HorariosAtendimentos.objects.filter(regional=regional).order_by('id')
    horarios_por_dia = {
        'Domingo': horarios.filter(dia_semana='Domingo'),
        'Segunda': horarios.filter(dia_semana='Segunda'),
        'Terça': horarios.filter(dia_semana='Terça'),
        'Quarta': horarios.filter(dia_semana='Quarta'),
        'Quinta': horarios.filter(dia_semana='Quinta'),
        'Sexta': horarios.filter(dia_semana='Sexta'),
        'Sábado': horarios.filter(dia_semana='Sábado'),
    }

    conteudo = {
        'horarios_por_dia': horarios_por_dia,
        'usuario_logado': request.user.usuario_relacionado,
    }
    
    return render(request, 'modulo_tecnico/meus_horarios.html', conteudo)



@require_http_methods(["POST"])
def meus_horarios_salvar(request):
    try:
        data = json.loads(request.body)
        horariosAtivos = data.get('horariosAtivos', [])
        horariosDesmarcados = data.get('horariosDesmarcados', [])
        
        HorariosAtendimentos.objects.filter(id__in=horariosAtivos).update(tecnico=request.user.usuario_relacionado)
        HorariosAtendimentos.objects.filter(id__in=horariosDesmarcados).update(tecnico=None)

        return JsonResponse({"success": True, "message": "Horários atualizados com sucesso!"}, status=200)
    except Exception as e:
        logger.error("Erro ao processar a requisição: %s", str(e))  # Logando o erro
        return JsonResponse({"success": False, "message": str(e)}, status=400)


def logout_tecnico(request):
    logout(request)
    return redirect('login_tecnico')


def tecnico_meus_dados(request):
    return render(request, 'modulo_tecnico/meus_dados.html')