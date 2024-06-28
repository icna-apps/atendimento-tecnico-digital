from django.core.management.base import BaseCommand
from apps.modulo_tecnico.models import HorariosAtendimentos, Especialidades
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Limpa todos os dados das tabelas: Horários de Atendimentos e Especialidades'

    def handle(self, *args, **options):
        HorariosAtendimentos.objects.all().delete()
        Especialidades.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Todos os registros foram deletados com sucesso!'))
