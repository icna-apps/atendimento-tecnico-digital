document.addEventListener('DOMContentLoaded', function() {

    const navbar = document.querySelector('#navbar')
    navbar.style.display = 'none';

    const btnCancelar = document.querySelector('#btnCancelar')
    btnCancelar.addEventListener('click', function(){
        window.location.href='/produtor/meus-atendimentos/'
    })

    const btnConfirmar = document.querySelector('#btnConfirmar')
    btnConfirmar.addEventListener('click', function(){
        window.location.href='/produtor/confirmacao-atendimento/'
    })

});