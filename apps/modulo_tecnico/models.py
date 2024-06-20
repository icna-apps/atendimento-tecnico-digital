from django.db import models
from django.utils import timezone
from apps.modulo_admin.models import Usuario
from setup.choices import LISTA_UFS_SIGLAS, ATIVIDADE_PRODUTIVA
from django.db.models import Case, When, Value, CharField, DateField
from django.db.models.functions import Now
from setup.utils import get_next_week_days
from datetime import datetime, timedelta


class HorariosAtendimentos(models.Model):
    data_ultima_atualizacao = models.DateTimeField(auto_now_add=True)
    responsavel_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='usuario_atualizacao_horario')
    regional = models.CharField(max_length=2, choices=LISTA_UFS_SIGLAS, null=False, blank=False)
    dia_semana = models.CharField(max_length=15, null=False, blank=False)
    horario = models.CharField(max_length=10, null=False, blank=False)
    tecnico = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='tecnico_horario_atendimento')

    def __str__(self):
        return f"{self.id} - Data/Hora: {self.dia_semana}-{self.horario}, Regional: {self.regional}, Técnico: {self.tecnico}"
    
    @property
    def horario_disponivel(self):
        return self.tecnico is None

    @staticmethod
    def disponiveis():
        return HorariosAtendimentos.objects.annotate(
            disponivel=Case(
                When(tecnico__isnull=False, then=Value('Sim')),
                default=Value('Não'),
                output_field=CharField(),
            )
        ).filter(disponivel='Sim')

            
    
class Especialidades(models.Model):
    #relacionamento
    usuario = models.ForeignKey(Usuario, on_delete=models.OneToOneField, null=True, blank=True, related_name='usuario_especialidade')

    #log
    data_registro = models.DateTimeField(auto_now_add=True)
    data_ultima_atualizacao = models.DateTimeField(auto_now=True)

    #especialidade
    especialidade = models.CharField(max_length=100, choices=ATIVIDADE_PRODUTIVA, null=False, blank=False)
    status_especialidade = models.BooleanField(default=False)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_cpf = models.CharField(max_length=14, null=True, blank=True)

    def __str__(self):
        return f"Usuário: {self.usuario.primeiro_ultimo_nome} - Especialidade: {self.especialidade} (ID: {self.id})"

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()