from django.shortcuts import render

def login_tecnico(request):

    imagem = 'assets/imagens/ateg_atendimento_digital.jpg'
    
    
    legenda = {
        'titulo': 'Luana e Cléber - DATeG Senar - Administração Central',
        'data': '07 de fevereiro de 2023',
        'fotografo': 'Fotográfo: Wenderson Araújo/Trilux'
    }

    conteudo = {
        'imagem': imagem,
        'legenda': legenda
    }
    return render(request, 'modulo_tecnico/login.html', conteudo)


def dashboard(request):
    return render(request, 'modulo_tecnico/dashboard.html')
