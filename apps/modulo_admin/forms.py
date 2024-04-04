from django import forms
from apps.modulo_admin.models import Usuario
from setup.choices import GENERO_SEXUAL

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
                'style': 'width: 160px',
                "id": "loginCPF"
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
                'autocomplete': 'current-password'
            }
        )
    )