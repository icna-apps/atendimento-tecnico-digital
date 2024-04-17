document.addEventListener('DOMContentLoaded', function() {

    $('#loginCPF').mask('000.000.000-00');
    // $('#loginSenha').mask('00/00/0000');

    $('#loginCPF').mask('000.000.000-00');


    const cpf = document.querySelector("#loginCPF")
    cpf.addEventListener('change', function() {

        if (this.value.length === 14) {
            const cpfValido = validaCPF(this.value);
            
            if (!cpfValido) {
                sweetAlert('CPF Inválido', 'error', 'red');
                this.value = '';
                return;
            }
        }
    });
    
    // Verifica se existe uma mensagem de erro e exibe com SweetAlert
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
        const errorMessage = errorMessageElement.getAttribute('data-message');
        if (errorMessage) {
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: errorMessage,
                confirmButtonColor: '#026e1d',
            });
        }
    }

    
    
    

    function verificarPreenchimento() {

        if (cpf.value == '') {
            sweetAlertPreenchimento({
                html: '<span style="font-size: 24px; font-weight: normal">Informe o <b>CPF</b></span>',
                iconColor: 'red'
            });
            return false
        }

        if (dataNascimento.value == '') {
            sweetAlertPreenchimento({
                html: '<span style="font-size: 24px;font-weight: normal">Informe a<br> <b>Data de Nascimento</b></span>',
                iconColor: 'red'
            });
            return false
        }

        return true
    }
});