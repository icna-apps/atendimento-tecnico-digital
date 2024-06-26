from django.core.management.base import BaseCommand
from apps.modulo_admin.models import Atendimento, AtendimentoConfirmacao, AtendimentoCancelado, AtendimentoRetorno

class Command(BaseCommand):
    help = 'Limpa todos os dados da tabela Atendimento'

    def handle(self, *args, **options):
        Atendimento.objects.all().delete()
        AtendimentoConfirmacao.objects.all().delete()
        AtendimentoCancelado.objects.all().delete()
        AtendimentoRetorno.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Todos os atendimentos foram deletados com sucesso!'))
