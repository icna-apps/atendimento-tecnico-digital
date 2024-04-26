from django.core.management.base import BaseCommand
from apps.modulo_admin.models import AtendimentoConfirmacao

class Command(BaseCommand):
    help = 'Limpa todos os dados da tabela AtendimentoConfirmacao'

    def handle(self, *args, **options):
        AtendimentoConfirmacao.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Todos os registros foram deletados com sucesso!'))

