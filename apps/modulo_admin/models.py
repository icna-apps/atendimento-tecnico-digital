from django.db import models
from django.contrib.auth.models import User
from setup.choices import GENERO_SEXUAL

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


class UF_Municipio(models.Model):
    cod_ibge = models.CharField(max_length=10, null=False, blank=False)
    uf_sigla = models.CharField(max_length=2, null=False, blank=False)
    uf = models.CharField(max_length=20, null=False, blank=False)
    municipio = models.CharField(max_length=35, null=False, blank=False)
    municipio_uf = models.CharField(max_length=40, null=False, blank=False)