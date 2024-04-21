from django.core.management.base import BaseCommand
from apps.modulo_admin.models import Atendimento

class Command(BaseCommand):
    help = 'Limpa todos os dados da tabela Atendimento'

    def handle(self, *args, **options):
        Atendimento.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Todos os atendimentos foram deletados com sucesso!'))
