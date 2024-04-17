from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib import auth
from apps.modulo_admin.forms import LoginForm, AtendimentoForm
from apps.modulo_admin.models import Usuario
from django.http import JsonResponse
from datetime import datetime

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

    conteudo = {
        'form': AtendimentoForm(),
    }

    return render(request, 'modulo_produtor/novo_atendimento.html', conteudo)

def produtor_meus_dados(request):
    return render(request, 'modulo_produtor/meus_dados.html')

def produtor_informacoes(request):
    return render(request, 'modulo_produtor/informacoes.html')