from django.shortcuts import render

def login_produtor(request):
    return render(request, 'modulo_produtor/login.html')

def produtor_meus_atendimentos_lista(request):
    return render(request, 'modulo_produtor/meus_atendimentos_lista.html')

def produtor_meus_dados(request):
    return render(request, 'modulo_produtor/meus_dados.html')

def produtor_informacoes(request):
    return render(request, 'modulo_produtor/informacoes.html')