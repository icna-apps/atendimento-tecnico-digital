document.addEventListener('DOMContentLoaded', function() {

    $('#loginCPF').mask('000.000.000-00');
    $('#loginDataNascimento').mask('00/00/0000');

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

    const botaoEntrar = document.querySelector('#botaoEntrar')
    botaoEntrar.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href='/produtor/meus-atendimentos/';
    })
});