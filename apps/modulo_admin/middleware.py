from django.conf import settings
from django.shortcuts import redirect
from django.urls import reverse

class LoginRequiredMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Código a ser executado para cada solicitação antes da view ser chamada.

        # Lista de rotas que não requerem autenticação.
        exceptions = [
            reverse('login_tecnico'),  # Substitua 'login' pelo nome da sua rota de login.
            '/admin/',  # Exemplo de como adicionar a administração do Django como exceção.
        ]

        if not request.user.is_authenticated:
            path = request.path_info
            if not any(path == exception or path.startswith(exception) for exception in exceptions):
                return redirect(settings.LOGIN_URL)  # Redireciona para a URL de login configurada em settings.

        response = self.get_response(request)

        # Código a ser executado para cada solicitação após a view ser chamada.

        return response
