document.addEventListener('DOMContentLoaded', function() {
    
    const navbar = document.querySelector('#navbar')
    navbar.style.display = 'none';

    const btnSair = document.querySelector('#btnSair')
    btnSair.addEventListener('click', function(){
        window.location.href='/produtor/meus-atendimentos/'
    })

});