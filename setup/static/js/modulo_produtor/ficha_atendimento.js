document.addEventListener('DOMContentLoaded', function() {

    const navbar = document.querySelector('#navbar')
    navbar.style.display = 'none';
    
    const btnSair = document.querySelector('#btnSair')
    btnSair.addEventListener('click', function(){
        window.location.href='/produtor/meus-atendimentos/'
    })

    const cardAtendimento = document.getElementById('cardAtendimento');
    const atendimentoId = cardAtendimento.getAttribute('data-id');

    const btnCancelar = document.querySelector('#btnCancelar')
    btnCancelar.addEventListener('click', function(){
        sweetAlertConfirmacao(
            tittle = "Atenção!",
            text = "Deseja cancelar o agendamento?",
            textoConfirmacao = "Sim, cancelar",
            textoCancelar = "Manter o agendamento",
            url = `/produtor/ficha-atendimento/cancelar/${atendimentoId}/`,
            csrfToken = getCSRFToken(),
            url_apos = `/produtor/ficha-atendimento/${atendimentoId}/`,
        )
    })

});