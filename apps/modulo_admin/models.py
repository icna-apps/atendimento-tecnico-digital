from django.db import models
from django.utils import timezone
from django.db.models import Case, When, Value, CharField, DateField
from django.db.models.functions import Now
from django.core.exceptions import ObjectDoesNotExist
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import date, datetime, timedelta
from datetime import datetime

from setup.choices import (GENERO_SEXUAL, LISTA_UFS_SIGLAS, 
                           ATIVIDADE_PRODUTIVA, LISTA_DATAS, LISTA_HORA_ATENDIMENTO, SUBSTATUS_ATENDIMENTO,
                           MOTIVO_CANCELAMENTO, TIPO_CONTA_BANCARIA,
                           STATUS_ATENDIMENTO, FORMA_ATENDIMENTO)


class Usuario(models.Model): 
    #relacionamento
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='usuario_relacionado')
    
    #log
    data_registro = models.DateTimeField(auto_now_add=True)
    data_ultima_atualizacao = models.DateTimeField(auto_now=True)
    
    #dados pessoais (dp)
    cpf = models.CharField(max_length=14, null=False, blank=False, unique=True)
    nome_completo = models.CharField(max_length=100, null=False, blank=False)
    data_nascimento = models.DateField(null=True, blank=True)
    sexo = models.CharField(max_length=100, choices=GENERO_SEXUAL, null=False, blank=False)
    reside_cod_ibge = models.CharField(max_length=10, null=True, blank=True)

    #contato (ctt)
    celular = models.CharField(max_length=17, null=True, blank=True)
    email_pessoal = models.EmailField(max_length=40, null=True, blank=True)

    #usuario está ativo
    usuario_is_ativo = models.BooleanField(default=True, null=False, blank=False, db_index=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_cpf = models.CharField(max_length=14, null=True, blank=True)

    def __str__(self):
        return f"{self.cpf} - {self.nome_completo} (ID: {self.id})"
    
    def primeiro_ultimo_nome(self):
        partes_nome = self.nome_completo.split()
        primeiro_nome = partes_nome[0]
        ultimo_nome = partes_nome[-1] if len(partes_nome) > 1 else ''
        return f"{primeiro_nome} {ultimo_nome}"
    
    def uf_municipio(self):
        if self.reside_cod_ibge:
            try:
                uf_municipio = UF_Municipio.objects.get(cod_ibge=self.reside_cod_ibge)
                return f"{uf_municipio.municipio}-{uf_municipio.uf_sigla}"
            except UF_Municipio.DoesNotExist:
                return "Código IBGE não encontrado"
        return "Código IBGE não informado"
    
    def uf(self):
        if self.reside_cod_ibge:
            try:
                uf_municipio = UF_Municipio.objects.get(cod_ibge=self.reside_cod_ibge)
                return f"{uf_municipio.uf_sigla}"
            except UF_Municipio.DoesNotExist:
                return "Código IBGE não encontrado"
        return "Código IBGE não informado"
    
    def municipio(self):
        if self.reside_cod_ibge:
            try:
                uf_municipio = UF_Municipio.objects.get(cod_ibge=self.reside_cod_ibge)
                return f"{uf_municipio.municipio}"
            except UF_Municipio.DoesNotExist:
                return "Código IBGE não encontrado"
        return "Código IBGE não informado"

    def vinculo_regional_ativo(self):
        return self.vinculo_tecnico_regional.filter(is_ativo=True).first()
    
    def regional_senar(self):
        try:
            vinculo = self.vinculo_tecnico_regional.get(is_ativo=True)
            return vinculo.regional
        except ObjectDoesNotExist:
            return "Nenhum vínculo ativo encontrado"
    
    def vinculo_produtor_regional_ativo(self):
        return self.vinculo_produtor_regional.filter(is_ativo=True).first()
    
    def regional_senar_produtor(self):
        try:
            vinculo = self.vinculo_produtor_regional.get(is_ativo=True)
            return vinculo.regional
        except ObjectDoesNotExist:
            return "Nenhum vínculo ativo encontrado"
        
    def idade(self):
        if self.data_nascimento:
            hoje = date.today()  # Usando 'date.today()' corretamente
            idade = hoje.year - self.data_nascimento.year
            # Verifica se ainda não chegou o aniversário deste ano
            if (hoje.month, hoje.day) < (self.data_nascimento.month, self.data_nascimento.day):
                idade -= 1
            return idade
        return "Data de nascimento não informada"

class InstituicoesFinanceiras(models.Model):
    codigo = models.CharField(max_length=4, null=False, blank=False)
    ispb = models.CharField(max_length=20, null=False, blank=False)
    nome = models.CharField(max_length=120, null=False, blank=False)
    ord = models.IntegerField(null=True, blank=True)

class UsuarioCNPJ(models.Model):
    #relacionamento
    usuario = models.ForeignKey(Usuario, on_delete=models.OneToOneField, null=True, blank=True, related_name='usuario_cnpj')
    banco_codigo = models.ForeignKey(InstituicoesFinanceiras, on_delete=models.OneToOneField, null=True, blank=True, related_name='banco_cnpj')

    #log
    data_registro = models.DateTimeField(auto_now_add=True)
    data_ultima_atualizacao = models.DateTimeField(auto_now=True)
    
    #dados da pessoa jurídica
    cnpj = models.CharField(max_length=18, null=True, blank=True, unique=True)
    razao_social = models.CharField(max_length=100, null=True, blank=True)
    
    #dados bancários
    agencia = models.CharField(max_length=10, null=True, blank=True)
    tipo_conta = models.CharField(max_length=100, choices=TIPO_CONTA_BANCARIA, null=True, blank=True)
    conta = models.CharField(max_length=20, null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_cpf = models.CharField(max_length=14, null=True, blank=True)

    def __str__(self):
        return f"CNPJ: {self.cnpj} - {self.razao_social} - Usuário: {self.usuario.primeiro_ultimo_nome}"

class UF_Municipio(models.Model):
    cod_ibge = models.CharField(max_length=10, null=False, blank=False)
    uf_sigla = models.CharField(max_length=2, null=False, blank=False)
    uf = models.CharField(max_length=20, null=False, blank=False)
    municipio = models.CharField(max_length=35, null=False, blank=False)
    municipio_uf = models.CharField(max_length=40, null=False, blank=False)



class VinculoTecnicoRegional(models.Model):
    # relacionamento
    usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='vinculo_tecnico_regional', null=True)
    
    # log
    data_registro = models.DateTimeField(auto_now_add=True)
    data_ultima_atualizacao = models.DateTimeField(auto_now=True)

    # vínculo atual
    regional = models.CharField(max_length=2, choices=LISTA_UFS_SIGLAS, null=False, blank=False)
    data_inicio = models.DateField(default=date.today, null=False, blank=False)
    data_fim = models.DateField(null=True, blank=True)
    is_ativo = models.BooleanField(default=True, null=False, blank=False, db_index=True)

    # delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_cpf = models.CharField(max_length=14, null=True, blank=True)

    def save(self, *args, **kwargs):
        # Verifica se já existe um vínculo ativo para o usuário
        if self.is_ativo:
            vinculo_ativo = VinculoTecnicoRegional.objects.filter(usuario=self.usuario, is_ativo=True).exclude(pk=self.pk)
            if vinculo_ativo.exists():
                raise ValidationError('Já existe um vínculo ativo com uma regional para este usuário.')

        # Verifica se a data_fim está preenchida quando is_ativo é False
        if not self.is_ativo and self.data_fim is None:
            raise ValidationError('A data de fim é requerida quando o vínculo não está ativo.')

        super(VinculoTecnicoRegional, self).save(*args, **kwargs)  # Chamando o save original

    def __str__(self):
        return f"{self.usuario.nome_completo}/{self.regional}"

class VinculoProdutorRegional(models.Model):
    # relacionamento
    usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='vinculo_produtor_regional', null=True)
    
    # log
    data_registro = models.DateTimeField(auto_now_add=True)
    data_ultima_atualizacao = models.DateTimeField(auto_now=True)

    # vínculo atual
    regional = models.CharField(max_length=2, choices=LISTA_UFS_SIGLAS, null=False, blank=False)
    data_inicio = models.DateField(default=date.today, null=False, blank=False)
    data_fim = models.DateField(null=True, blank=True)
    is_ativo = models.BooleanField(default=True, null=False, blank=False, db_index=True)

    # delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_cpf = models.CharField(max_length=14, null=True, blank=True)

    def save(self, *args, **kwargs):
        # Verifica se já existe um vínculo ativo para o usuário
        if self.is_ativo:
            vinculo_ativo = VinculoProdutorRegional.objects.filter(usuario=self.usuario, is_ativo=True).exclude(pk=self.pk)
            if vinculo_ativo.exists():
                raise ValidationError('Já existe um vínculo ativo com uma regional para este usuário.')

        # Verifica se a data_fim está preenchida quando is_ativo é False
        if not self.is_ativo and self.data_fim is None:
            raise ValidationError('A data de fim é requerida quando o vínculo não está ativo.')

        super(VinculoProdutorRegional, self).save(*args, **kwargs)  # Chamando o save original

    def __str__(self):
        return f"{self.usuario.nome_completo}/{self.regional}"

class Atendimento(models.Model): 
    #log
    data_registro = models.DateTimeField(auto_now_add=True)
    data_ultima_atualizacao = models.DateTimeField(auto_now=True)
    
    #regional
    regional = models.CharField(max_length=2, choices=LISTA_UFS_SIGLAS, null=False, blank=False, default='MS')

    #técnico e produtor
    tecnico = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='tecnico_atendimento')
    produtor = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='produtor_atendimento')

    #retorno
    retorno = models.BooleanField(default=False)

    #data, hora
    data = models.DateField(null=False, blank=False)
    hora = models.CharField(max_length=5, null=False, blank=False)
    
    #status
    status = models.CharField(max_length=15, choices=STATUS_ATENDIMENTO, null=False, blank=False)
    substatus = models.CharField(max_length=60, choices=SUBSTATUS_ATENDIMENTO, null=True, blank=True)

    #dados do agendamento
    atividade_produtiva = models.CharField(max_length=120, choices=ATIVIDADE_PRODUTIVA, null=False, blank=False)
    topico = models.CharField(max_length=120, null=False, blank=False)
    mais_informacoes = models.TextField(null=True, blank=True)
    
    #imagens enviadas pelo produtor
    imagem01 = models.BinaryField(null=True, blank=True)
    imagem02 = models.BinaryField(null=True, blank=True)
    imagem03 = models.BinaryField(null=True, blank=True)
    
    #relatório
    relatorio = models.TextField(null=True, blank=True)
    relatorio_atualizacao = models.DateTimeField(null=True, blank=True)

    #avaliação do atendimento
    avaliacao_atendimento = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True
    )

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_status2 = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_cpf = models.CharField(max_length=14, null=True, blank=True)

    def __str__(self):
        return f"{self.id} - Data/Hora: {self.data} - {self.hora} - {self.atividade_produtiva} - Tópico(s): {self.topico}"

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

    def atendimento_ativo(self):
        return self.status != 'cancelado'

    def atendimento_id(self):
        year_suffix = self.data.strftime('%y')
        id_str = str(self.id).zfill(4)
        return f"{id_str}/{year_suffix}"

    @classmethod
    def proxima_semana_agendamentos(cls, regional):
        data_inicio = timezone.now().date() 
        data_fim = data_inicio + timedelta(days=7)

        agendamentos = cls.objects.filter(
            regional=regional,
            data__range=(data_inicio, data_fim),
            del_status=False
        ).exclude(
            status='cancelado'
        ).order_by('data', 'hora')

        lista_agendamentos = [(ag.data.strftime('%d/%m/%Y'), ag.hora) for ag in agendamentos]

        return lista_agendamentos

class AtendimentoConfirmacao(models.Model): 
    #log
    data_registro = models.DateTimeField(auto_now_add=True)
    data_ultima_atualizacao = models.DateTimeField(auto_now=True)
    
    #atendimento
    atendimento = models.ForeignKey(Atendimento, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimento_confirmacao')

    #confirmação do atendimento
    imagem = models.BinaryField(null=True, blank=True)
    forma_atendimento = models.CharField(max_length=60, choices=FORMA_ATENDIMENTO, null=False, blank=False)
    duracao_minutos = models.PositiveIntegerField(null=False, blank=False)
    qualidade_internet = models.PositiveIntegerField(null=False, blank=False)
    observacoes = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_cpf = models.CharField(max_length=14, null=True, blank=True)

    def __str__(self):
        return f"ID da Confirmação: {self.id} - ID Atendimento: {self.atendimento.id}"

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

class AtendimentoCancelado(models.Model): 
    #log
    data_registro = models.DateTimeField(auto_now_add=True)
    data_ultima_atualizacao = models.DateTimeField(auto_now=True)
    
    #atendimento
    atendimento = models.ForeignKey(Atendimento, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimento_cancelado')

    #atendimento cancelado
    motivo_cancelamento = models.CharField(max_length=100, choices=MOTIVO_CANCELAMENTO, null=False, blank=False)
    imagem = models.BinaryField(null=True, blank=True)
    observacoes = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_cpf = models.CharField(max_length=14, null=True, blank=True)

    def __str__(self):
        return f"ID do Cancelamento: {self.id} - ID Atendimento: {self.atendimento.id}"

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

class AtendimentoRetorno(models.Model): 
    #log
    data_registro = models.DateTimeField(auto_now_add=True)
    data_ultima_atualizacao = models.DateTimeField(auto_now=True)
    
    #atendimento
    atendimento_anterior = models.ForeignKey(Atendimento, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimento_anterior')
    atendimento_retorno = models.ForeignKey(Atendimento, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimento_retorno')

    #atendimento cancelado
    justificativa = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_cpf = models.CharField(max_length=14, null=True, blank=True)

    def __str__(self):
        return f"ID do Retorno: {self.id} - ID Atendimento Anterior: {self.atendimento_anterior.id} - ID Atendimento Retorno: {self.atendimento_retorno.id}"

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()