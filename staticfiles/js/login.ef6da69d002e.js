document.addEventListener('DOMContentLoaded', function() {

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
                confirmButtonColor: '#3085d6',
            });
        }
    }
    
    




});

