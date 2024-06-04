# Importações padrão do Python
import json
import logging
from datetime import date, datetime, timedelta

# Importações de terceiros do Django
from django.contrib import auth
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.http import JsonResponse
from django.db.models import Avg
from django.shortcuts import redirect, render
from django.utils import timezone
from django.utils.dateformat import format
from django.views.decorators.http import require_http_methods

# Importações de aplicativos locais
from apps.modulo_admin.forms import LoginForm, AtendimentoForm
from apps.modulo_admin.models import (Usuario, Atendimento, AtendimentoConfirmacao, 
                                      AtendimentoCancelado, AtendimentoRetorno, UF_Municipio,
                                      InstituicoesFinanceiras, UsuarioCNPJ)
from apps.modulo_tecnico.models import HorariosAtendimentos
from apps.modulo_admin.services import enviar_sms
from setup.utils import get_next_week_days
from setup.choices import STATUS_ATENDIMENTO, ATIVIDADE_PRODUTIVA, TOPICO_ATENDIMENTO, GENERO_SEXUAL, TIPO_CONTA_BANCARIA



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
                return redirect('tecnico_dashboard')
        
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


def tecnico_dashboard(request):

    tecnico = request.user.usuario_relacionado
    regional = tecnico.regional_senar()
    atendimentos = Atendimento.objects.filter(tecnico=tecnico)
    atendimentos_cancelados = atendimentos.filter(status='cancelado').count()
    atendimentos_agendados = atendimentos.filter(status='agendado').count()
    atendimentos_atendidos = atendimentos.filter(status='atendido').count()
    atendimentos_finalizados = atendimentos.filter(status='finalizado').count()
    media_geral = atendimentos.filter(substatus='produtor_avaliou', regional=regional).aggregate(media=Avg('avaliacao_atendimento'))
    media_geral = media_geral.get('media', 0)
    media_tecnico = atendimentos.filter(substatus='produtor_avaliou', tecnico=tecnico).aggregate(media=Avg('avaliacao_atendimento'))
    media_tecnico = media_tecnico.get('media', 0)

    conteudo = {
        'atendimentos': atendimentos,
        'atendimentos_cancelados': atendimentos_cancelados,
        'atendimentos_agendados': atendimentos_agendados,
        'atendimentos_atendidos': atendimentos_atendidos,
        'atendimentos_finalizados': atendimentos_finalizados,
        'media_geral': media_geral,
        'media_tecnico': media_tecnico,
    }

    return render(request, 'modulo_tecnico/dashboard.html', conteudo)


def tecnico_atendimentos(request):

    tecnico = request.user.usuario_relacionado
    atendimentos = Atendimento.objects.filter(tecnico=tecnico).order_by('-id')

    #lista_opcoes
    lista_status = STATUS_ATENDIMENTO
    lista_atividades = ATIVIDADE_PRODUTIVA
    lista_topicos = TOPICO_ATENDIMENTO

    conteudo = {
        'atendimentos': atendimentos,
        'lista_status': lista_status,
        'lista_atividades': lista_atividades,
        'lista_topicos': lista_topicos,
    }

    return render(request, 'modulo_tecnico/lista_atendimentos.html', conteudo)


def tecnico_meus_horarios(request):

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
def tecnico_meus_horarios_salvar(request):
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
    lista_ufs = UF_Municipio.objects.values_list('uf_sigla', flat=True).order_by('uf_sigla').distinct()
    lista_genero_sexual = GENERO_SEXUAL
    lista_bancos = InstituicoesFinanceiras.objects.all()
    tipo_conta_bancaria = TIPO_CONTA_BANCARIA

    tecnico = request.user.usuario_relacionado
    # cnpj = UsuarioCNPJ.objects.get(usuario=tecnico)

    conteudo = {
        'lista_ufs': lista_ufs,
        'lista_genero_sexual': lista_genero_sexual,
        'lista_bancos': lista_bancos,
        'tipo_conta_bancaria': tipo_conta_bancaria,
        # 'cnpj': cnpj,
        'cnpj': '',
    }

    return render(request, 'modulo_tecnico/meus_dados.html', conteudo)


def tecnico_meusdados_atualizar(request):
    #Objeto POST
    post_data = request.POST.copy()

    #Meus Dados
    cpf = post_data.get('cpf', '')
    nomeCompleto = post_data.get('nomeCompleto', '')
    dataNascimento = post_data.get('dataNascimento', '')
    sexo = post_data.get('sexo', '')
    cod_ibge = post_data.get('cod_ibge', '')
    celular = post_data.get('celular', '')
    email = post_data.get('email', '')

    #Dados Bancários
    banco_codigo = post_data.get('bancoCodigo', '')
    agencia_bancaria = post_data.get('agenciaBancaria', '')
    tipo_conta_bancaria = post_data.get('tipoContaBancaria', '')
    numero_conta = post_data.get('numeroConta', '')
    razao_social = post_data.get('razao_social', '')

    #Usuário
    usuario = request.user.usuario_relacionado
    
    try:
        #Dados da pessoa física
        usuario.cpf = cpf
        usuario.nome_completo = nomeCompleto
        usuario.data_nascimento = dataNascimento
        usuario.sexo = sexo
        usuario.reside_cod_ibge = cod_ibge
        usuario.celular = celular
        usuario.email_pessoal = email
        usuario.save()

        #Dados do CNPJ
        instituicao_financeira = None
        if banco_codigo:
            instituicao_financeira = InstituicoesFinanceiras.objects.filter(codigo=banco_codigo).first()
        usuario_cnpj, created = UsuarioCNPJ.objects.get_or_create(
            usuario=usuario,
            defaults={
                'cnpj': post_data.get('cnpj', ''),
                'razao_social': razao_social,
                'banco_codigo': instituicao_financeira,
                'agencia': agencia_bancaria,
                'tipo_conta': tipo_conta_bancaria,
                'conta': numero_conta
            }
        )
        if not created:
            # Se o CNPJ já existir, apenas atualize os campos relevantes
            usuario_cnpj.cnpj = post_data.get('cnpj', usuario_cnpj.cnpj)
            usuario_cnpj.razao_social = razao_social
            usuario_cnpj.banco_codigo = instituicao_financeira
            usuario_cnpj.agencia = agencia_bancaria
            usuario_cnpj.tipo_conta = tipo_conta_bancaria
            usuario_cnpj.conta = numero_conta
            usuario_cnpj.save()

        return JsonResponse({'atualizado': "sim"})
        
    except ValueError:
        return JsonResponse({'atualizado': "nao"})


def tecnico_ficha_atendimento(request, id):

    atendimento = Atendimento.objects.get(id=id)
    
    #Regional do Produtor
    regional = request.user.usuario_relacionado.regional_senar_produtor()
    tecnico = request.user.usuario_relacionado

    #Horários dos Técnicos
    horarios_tecnicos_dias_semana = HorariosAtendimentos.disponiveis().filter(regional=regional, tecnico=tecnico).values_list('dia_semana', 'horario').distinct()
    proxima_semana = get_next_week_days()
    horarios_tecnicos_datas = [(proxima_semana[dia], horario)
                             for dia, horario in horarios_tecnicos_dias_semana if dia in proxima_semana]

    #Agendamentos
    agendamentos = Atendimento.proxima_semana_agendamentos(regional)

    #Horários disponíveis
    horarios_disponiveis = [horario for horario in horarios_tecnicos_datas if horario not in agendamentos]
    
    #Lista de datas disponíveis
    datas_unicas = sorted(set(data for data, _ in horarios_disponiveis))
    datas_unicas = [datetime.strptime(data, '%d/%m/%Y') for data in datas_unicas]
    datas_unicas.sort()
    datas_unicas = [data.strftime('%d/%m/%Y') for data in datas_unicas]
    datas_choices = [('', '')]
    data_choices = datas_choices + [(data, data) for data in datas_unicas]
    formAtendimentoRetorno = AtendimentoForm(data_choices=data_choices)
    
    try:
        atendimentoConfirmacao = AtendimentoConfirmacao.objects.get(atendimento=atendimento)
    except AtendimentoConfirmacao.DoesNotExist:
        atendimentoConfirmacao = None

    try:
        atendimentoCancelado = AtendimentoCancelado.objects.get(atendimento=atendimento)
    except AtendimentoCancelado.DoesNotExist:
        atendimentoCancelado = None
    
    try:
        atendimentoRetorno = AtendimentoRetorno.objects.get(atendimento_anterior=atendimento)
    except AtendimentoRetorno.DoesNotExist:
        atendimentoRetorno = None

    conteudo = {
        'atendimento': atendimento,
        'atendimentoConfirmacao': atendimentoConfirmacao,
        'atendimentoCancelado': atendimentoCancelado,
        'atendimentoRetorno': atendimentoRetorno,
        'formAtendimentoRetorno': formAtendimentoRetorno,
        'horarios_disponiveis': horarios_disponiveis,
    }

    return render(request, 'modulo_tecnico/ficha_atendimento.html', conteudo)



def tecnico_atendimento_salvar_relatorio(request, id):
    if request.method == 'POST':
        import json
        data = json.loads(request.body)
        relatorio = data.get('relatorio')
        try:
            atendimento = Atendimento.objects.get(id=id)
            atendimento.relatorio = relatorio
            atendimento.relatorio_atualizacao = timezone.now()
            atendimento.save()
            
            data_ajustada = atendimento.relatorio_atualizacao - timedelta(hours=3)
            data_formatada = format(data_ajustada, 'd/m/Y H:i:s')
            

            return JsonResponse({'salvo': "sim", 'dataRelatorio': data_formatada })
        except Atendimento.DoesNotExist:
            return JsonResponse({'salvo': "nao"}, status=404)
    return JsonResponse({'salvo': "nao"}, status=405)

def tecnico_confirmar_atendimento(request, id):
    #Objeto POST
    post_data = request.POST.copy()

    #Atendimento
    atendimento = Atendimento.objects.get(id=id)

    #dados da confirmação
    imagem = ''
    forma_atendimento = post_data.get('formaAtendimento', '')
    duracao_minutos = post_data.get('duracaoMinutos', '')
    qualidade_internet = post_data.get('internet_quality', '')
    observacoes = post_data.get('observacoes', '')
    
    try:
        confirmacao = AtendimentoConfirmacao(
            imagem = imagem,
            atendimento = atendimento,
            forma_atendimento = forma_atendimento,
            duracao_minutos = duracao_minutos,
            qualidade_internet = qualidade_internet,
            observacoes = observacoes
        )
        confirmacao.save()

        atendimento.status = 'atendido'
        atendimento.substatus = 'aguardando_relatorio'
        atendimento.save()

        return JsonResponse({'confirmado': "sim"})
        
    except ValueError:
        return JsonResponse({'agendado': "nao"})


def tecnico_cancelar_atendimento(request, id):
    #Objeto POST
    post_data = request.POST.copy()

    #Atendimento
    atendimento = Atendimento.objects.get(id=id)

    #dados da confirmação
    imagem = ''
    motivo_cancelamento = post_data.get('cancelamentoMotivo', '')
    observacoes = post_data.get('cancelamentoObservacoes', '')
    
    try:
        cancelamento = AtendimentoCancelado(
            atendimento = atendimento,
            motivo_cancelamento = motivo_cancelamento,
            imagem = imagem,
            observacoes = observacoes,
        )
        cancelamento.save()

        atendimento.status = 'cancelado'
        if motivo_cancelamento == 'produtor_nao_compareceu':
            atendimento.substatus = 'cancelado_produtor'
        else:
            atendimento.substatus = 'cancelado_tecnico'
        atendimento.save()

        return JsonResponse({'cancelado': "sim"})
        
    except ValueError:
        return JsonResponse({'cancelado': "nao"})


def tecnico_agendar_retorno(request, id):
    #Objeto POST
    post_data = request.POST.copy()
    
    #Atendimento
    atendimento = Atendimento.objects.get(id=id)
    produtor = atendimento.produtor
    tecnico = atendimento.tecnico
    regional = atendimento.regional

    #Infos do novo atendimento
    atividade_produtiva = post_data.get('atividade_produtiva', '')
    topico = post_data.get('topico', '')
    mais_informacoes = post_data.get('mais_informacoes', '')
    status = 'agendado'
    justificativa = post_data.get('atendimentoRetornoJustificativa', '')

    #Data e hora
    data_str = post_data.get('data', '')
    data = datetime.strptime(data_str, '%d/%m/%Y').date()
    hora = post_data.get('hora', '')
    
    try:
        #Agendar novo atendimento
        novo_atendimento = Atendimento(
            regional=regional,
            tecnico=tecnico,
            produtor=produtor,
            retorno=True,
            atividade_produtiva=atividade_produtiva,
            topico=topico,
            data=data,
            hora=hora,
            mais_informacoes=mais_informacoes,
            status=status,
            substatus='aguardando_atendimento'
        )
        novo_atendimento.save()

        #Registrar o retorno
        retorno = AtendimentoRetorno(
            atendimento_anterior=atendimento,
            atendimento_retorno=novo_atendimento,
            justificativa=justificativa
        )
        retorno.save()

        #enviar notificação para o técnico
        retorno_id = novo_atendimento.atendimento_id()
        data_formatada = novo_atendimento.data.strftime('%d/%m/%Y')
        hora_formatada = novo_atendimento.hora
        detalhes_atividade = novo_atendimento.get_atividade_produtiva_display()
        detalhes_topico = novo_atendimento.topico
        produtor = novo_atendimento.produtor.primeiro_ultimo_nome()
        municipio = novo_atendimento.produtor.uf_municipio()

        # Compõe a mensagem
        mensagem = (
            f"CNA Digital - {retorno_id}\n"
            f"Novo atendimento agendado!\n"
            f"-----------\n"
            f"Data: {data_formatada}\n"
            f"Hora: {hora_formatada}\n"
            f"-----------\n"
            f"Atividade: {detalhes_atividade}\n"
            f"Tópico: {detalhes_topico}\n"
            f"-----------\n"
            f"Produtor: {produtor}\n"
            f"Município-UF: {municipio}"
        )

        enviar_sms(
            novo_atendimento.id, 
            mensagem,
            tecnico.celular
        )

        return JsonResponse({'retorno': "sim", 'id_retorno': novo_atendimento.id})
        
    except ValueError:
        return JsonResponse({'retorno': "nao"})
    

def tecnico_finalizar_atendimento(request, id):
    atendimento = Atendimento.objects.get(id=id)
    try:
        atendimento.status = 'finalizado'
        atendimento.substatus = 'produtor_avaliar'
        atendimento.save()
        return JsonResponse({'finalizado': "sim"})
    except ValueError:
        return JsonResponse({'finalizado': "nao"})

def tecnico_filtro_atendimento(request):
    status = request.GET.get('status', None)
    atividade = request.GET.get('atividade', None)
    topico = request.GET.get('topico', None)
    notaAvaliacao = request.GET.get('notaAvaliacao', None)
    produtor = request.GET.get('produtor', None)

    filters = {'del_status': False}
    if status:
        filters['status'] = status
    if atividade:
        filters['atividade_produtiva'] = atividade
    if topico:
        filters['topico'] = topico
    if notaAvaliacao:
        filters['avaliacao_atendimento'] = notaAvaliacao
    if produtor:
        filters['produtor__nome_completo__icontains'] = produtor
    
    atendimentos = Atendimento.objects.filter(**filters).order_by('-id')
    
    data_list = [
        {
            'id': atendimento.atendimento_id(),
            'id_simples': atendimento.id,
            'data': atendimento.data.strftime('%d/%m/%Y') if isinstance(atendimento.data, date) else atendimento.data,
            'hora': atendimento.hora.strftime('%H:%M') if isinstance(atendimento.hora, datetime) else atendimento.hora,
            'atividade': atendimento.get_atividade_produtiva_display(),  # Chamando o método corretamente
            'topico': atendimento.topico,
            'status': atendimento.get_status_display(),  # Chamando o método corretamente
            'substatus': atendimento.get_substatus_display(),  # Chamando o método corretamente
            'notaAvaliacao': atendimento.avaliacao_atendimento,
            'produtor': atendimento.produtor.primeiro_ultimo_nome(),
            'idade': atendimento.produtor.idade(),
            'municipio': atendimento.produtor.uf_municipio()
            
        }
        for atendimento in atendimentos
    ]

    print("Data List: ", data_list)

    return JsonResponse({'data': data_list})

def tecnico_pagamentos(request):
    return render(request, 'modulo_tecnico/lista_pagamentos.html')