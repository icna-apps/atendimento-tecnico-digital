from django.core.management.base import BaseCommand
from apps.modulo_admin.models import Usuario, UsuarioCNPJ, VinculoProdutorRegional, VinculoTecnicoRegional
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Limpa todos os dados das tabelas de Usuários'

    def handle(self, *args, **options):
        
        UsuarioCNPJ.objects.all().delete()
        VinculoProdutorRegional.objects.all().delete()
        VinculoTecnicoRegional.objects.all().delete()
        Usuario.objects.all().delete()
        User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Todos os usuários foram deletados com sucesso!'))
