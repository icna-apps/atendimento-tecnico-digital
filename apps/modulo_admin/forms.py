from django import forms
from django.forms.widgets import ClearableFileInput
from apps.modulo_admin.models import Usuario, Atendimento
from setup.choices import (GENERO_SEXUAL, ATIVIDADE_PRODUTIVA, TOPICO_ATENDIMENTO, STATUS_ATENDIMENTO, 
                           LISTA_HORA_ATENDIMENTO, LISTA_DATAS)

#Adicionando opção vazia
opcao_vazia = [('', '')]
ATIVIDADE_PRODUTIVA = opcao_vazia + ATIVIDADE_PRODUTIVA
TOPICO_ATENDIMENTO = opcao_vazia + TOPICO_ATENDIMENTO
LISTA_DATAS = opcao_vazia + LISTA_DATAS
LISTA_HORA_ATENDIMENTO =  opcao_vazia + LISTA_HORA_ATENDIMENTO


class CadastroForm(forms.ModelForm):
    cpf = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'formCPF',
            'style': 'width: 160px',
            'autocomplete': 'off'
        }),
        label='Informe seu CPF',
        initial='',
        required=True
    )
    nome_completo = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'formNome',
            'autocomplete': 'off'
        }),
        label='Nome Completo',
        required=True
    )
    sexo = forms.ChoiceField(
        choices=GENERO_SEXUAL,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'formSexo',
            'autocomplete': 'off'
        }),
        label='Sexo',
        initial='',
        required=True
    )
    data_nascimento = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'id': 'formDataNascimento',
            'type': 'date',
            'autocomplete': 'off',
        }),
        label='Data de Nascimento',
        required=True
    )
    celular = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'formCelular',
            'style': 'width: 150px',
            'autocomplete': 'off',
        }),
        label='Celular',
        required=True
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'id': 'formEmail',
            'style': 'width: 18vw',
            'autocomplete': 'off',
        }),
        label='Email',
        required=True
    )
    cod_ibge = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'formCodIBGE',
            'style': 'width: 20vw',
            'autocomplete': 'off',
        }),
        label='Email',
        required=True
    )
    senha1 = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'formSenha1',
            'type': 'password',
            'autocomplete': 'current-password'
        }),
        label='Senha',
        initial='',
        required=True
    )
    senha2 = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'formSenha2',
            'type': 'password',
            'autocomplete': 'current-password'
        }),
        label='Repita a Senha',
        initial='',
        required=True
    )

    class Meta:
        model = Usuario
        exclude = ['user', 'usuario_registro', 'usuario_atualizacao', 'registro_data', 'ult_atual_data', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def save(self, commit=True, *args, **kwargs):
        usuario = super().save(commit=False, *args, **kwargs)
        if commit:
            usuario.save()
        return usuario

class LoginForm(forms.Form):
    cpf=forms.CharField(
        label="CPF",
        required=True,
        max_length=14,
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "id": "loginCPF",
                "placeholder": "CPF",
                "inputmode": 'numeric',
            }
        )
    )
    senha=forms.CharField(
        label="Senha",
        required=True,
        max_length=50,
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "id": "loginSenha",
                "placeholder": "Senha"
            }
        )
    )


class AtendimentoForm(forms.ModelForm):
    atividade_produtiva = forms.ChoiceField(
        choices=ATIVIDADE_PRODUTIVA,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_atividade_produtiva'
        }),
        label='Atividade Produtiva',
        initial='',
        required=True,
    )
    topico = forms.ChoiceField(
        choices=TOPICO_ATENDIMENTO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_topico'
        }),
        label='Tópico do atendimento',
        initial='',
        required=True,
    )
    data = forms.ChoiceField(
        choices=LISTA_DATAS,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_data'
        }),
        required=True,
        label='Data'
    )
    hora = forms.ChoiceField(
        choices=LISTA_HORA_ATENDIMENTO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_hora'
        }),
        label='Hora',
        initial='',
        required=True,
    )
    mais_informacoes = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control auto-expand',
            'rows': 1,
            'line-height': 1.0,
            'style': 'padding-top: 60px; height: 20vh;',
            'id': 'id_mais_informacoes'
            }),
        required=False,
        label='Fale sobre o problema ou dúvida a ser tratada no atendimento.'
    )
    imagem01 = forms.ImageField(
        widget=ClearableFileInput(attrs={
            'class': 'form-control',
            'id': 'id_imagem01'
        }),
        label='Imagem 01',
        required=False,
    )
    imagem02 = forms.ImageField(
        widget=ClearableFileInput(attrs={
            'class': 'form-control',
            'id': 'id_imagem02'
        }),
        label='Imagem 01',
        required=False,
    )
    imagem03 = forms.ImageField(
        widget=ClearableFileInput(attrs={
            'class': 'form-control',
            'id': 'id_imagem03'
        }),
        label='Imagem 01',
        required=False,
    )

    status = forms.ChoiceField(
        choices=STATUS_ATENDIMENTO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_status'
        }),
        label='Status do atendimento',
        initial='',
        required=True,
    )
    
    class Meta:
        model = Atendimento
        exclude = ['log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def clean_mais_informacoes(self):
        mais_informacoes = self.cleaned_data.get('mais_informacoes')
        return mais_informacoes or "Nada informado."