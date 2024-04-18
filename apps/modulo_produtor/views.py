from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib import auth
from apps.modulo_admin.forms import LoginForm, AtendimentoForm
from apps.modulo_admin.models import Usuario, Atendimento
from apps.modulo_tecnico.models import HorariosAtendimentos
from django.http import JsonResponse
from datetime import datetime, timedelta
from setup.utils import get_next_week_days


def login_produtor(request):
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
            elif not usuario_validacao.vinculo_produtor_regional_ativo():
                mensagem_erro = "Usuário sem acesso ao módulo!"
            else:
                # Todas as verificações passaram, então podemos logar o usuário
                auth.login(request, usuario)
                return redirect('produtor_meus_atendimentos_lista')
        
        # Se qualquer uma das verificações falhar, setar o valor inicial de 'cpf' e renderizar novamente
        form.fields['cpf'].initial = cpf
        conteudo = {
            'form': form,
            'mensagem': mensagem_erro
        }
        return render(request, 'modulo_produtor/login.html', conteudo)

    conteudo = {
        'form': form,
    }
    logout(request)


    return render(request, 'modulo_produtor/login.html', conteudo)


def produtor_meus_atendimentos_lista(request):
    return render(request, 'modulo_produtor/meus_atendimentos_lista.html')

def produtor_novo_atendimento(request):

    #Regional do Produtor
    regional_produtor = request.user.usuario_relacionado.regional_senar_produtor()

    #Horários dos Técnicos
    horarios_tecnicos_dias_semana = HorariosAtendimentos.disponiveis().filter(regional=regional_produtor).values_list('dia_semana', 'horario').distinct()
    proxima_semana = get_next_week_days()
    horarios_tecnicos_datas = [(proxima_semana[dia], horario)
                             for dia, horario in horarios_tecnicos_dias_semana if dia in proxima_semana]

    #Agendamentos
    agendamentos = Atendimento.proxima_semana_agendamentos(regional_produtor)

    #Horários disponíveis
    horarios_disponiveis = [horario for horario in horarios_tecnicos_datas if horario not in agendamentos]
    
    #Lista de datas disponíveis
    datas_unicas = sorted(set(data for data, _ in horarios_disponiveis))
    datas_choices = [('', '')]
    data_choices = datas_choices + [(data, data) for data in datas_unicas]
    
    #Formulário
    form = AtendimentoForm(data_choices=data_choices)

    conteudo = {
        'form': form,
        'horarios_disponiveis': horarios_disponiveis,
    }

    return render(request, 'modulo_produtor/novo_atendimento.html', conteudo)

def produtor_confirmacao_atendimento(request):
    return render(request, 'modulo_produtor/confirmacao_agendamento.html')

def produtor_meus_dados(request):
    return render(request, 'modulo_produtor/meus_dados.html')

def produtor_informacoes(request):
    return render(request, 'modulo_produtor/informacoes.html')