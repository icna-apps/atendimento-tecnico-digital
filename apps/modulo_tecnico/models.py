from django.db import models
from apps.modulo_admin.models import Usuario
from setup.choices import LISTA_UFS_SIGLAS

class HorariosAtendimentos(models.Model):
    data_ultima_atualizacao = models.DateTimeField(auto_now_add=True)
    responsavel_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='usuario_atualizacao_horario')
    regional = models.CharField(max_length=2, choices=LISTA_UFS_SIGLAS, null=False, blank=False)
    dia_semana = models.CharField(max_length=15, null=False, blank=False)
    horario = models.CharField(max_length=10, null=False, blank=False)
    tecnico = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='tecnico_horario_atendimento')


    def __str__(self):
        return f"{self.id} - Data/Hora: {self.dia_semana}-{self.horario}, Regional: {self.regional}, Técnico: {self.tecnico}"
    
    def horario_disponivel(self):
        if self.tecnico:
            return False
        else:
            return True
