from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.http import JsonResponse
from django.http import HttpResponse
from django.contrib import auth
from apps.modulo_admin.forms import LoginForm, AtendimentoForm, CadastroForm
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


def produtor_realizar_agendamento(request):
    
    #Objeto POST
    post_data = request.POST.copy()
    
    #Regional
    regional = request.user.usuario_relacionado.regional_senar_produtor()

    #Infos do atendimento
    atividade_produtiva = post_data.get('atividade_produtiva', '')
    topico = post_data.get('topico', '')
    mais_informacoes = post_data.get('mais_informacoes', '')
    imagem01 = request.FILES.get('imagem01')
    imagem02 = request.FILES.get('imagem02')
    imagem03 = request.FILES.get('imagem03')
    status = 'agendado'  # Já definido diretamente

    #Data e hora
    data_str = post_data.get('data', '')
    data = datetime.strptime(data_str, '%d/%m/%Y').date()
    hora = post_data.get('hora', '')
    

    # #Encontrando o técnico
    dia_semana_index = data.weekday()  # Retorna um inteiro de 0 a 6
    nomes_dias = {0: 'Segunda', 1: 'Terça', 2: 'Quarta', 3: 'Quinta', 4: 'Sexta', 5: 'Sábado', 6: 'Domingo'}
    dia_semana = nomes_dias[dia_semana_index]    
    horario = HorariosAtendimentos.objects.filter(
        dia_semana=dia_semana,
        horario=hora,
        regional=regional
    ).first()
    tecnico = horario.tecnico
    
    try:
        novo_atendimento = Atendimento(
            regional=regional,
            tecnico=tecnico,
            atendimento_retorno=False,  # Valor padrão ou dependendo do POST
            atividade_produtiva=atividade_produtiva,
            topico=topico,
            data=data,
            hora=hora,
            mais_informacoes=mais_informacoes,
            imagem01=imagem01,
            imagem02=imagem02,
            imagem03=imagem03,
            status=status
        )
        novo_atendimento.save()
        return JsonResponse({'agendado': "sim", 'id_agendamento': novo_atendimento.id})
        
    except ValueError:
        return JsonResponse({'agendado': "nao"})

def produtor_confirmacao_atendimento(request, id):
    
    atendimento = Atendimento.objects.get(id=id)

    conteudo = {
        'atendimento': atendimento,
    }
    

    return render(request, 'modulo_produtor/confirmacao_agendamento.html', conteudo)

def produtor_meus_dados(request):

    form = CadastroForm(instance=request.user)
    conteudo = {
        'form': form,
    }

    return render(request, 'modulo_produtor/meus_dados.html', conteudo)

def produtor_informacoes(request):
    return render(request, 'modulo_produtor/informacoes.html')