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

    const btnGerarRelatorio = document.querySelector('#btnGerarRelatorio');
    btnGerarRelatorio.addEventListener('click', function(event) {
        event.preventDefault();
        // Abre a URL em uma nova aba
        var newWindow = window.open(`/relatorio-atendimento/${atendimentoId}`, '_blank');
        // Fecha a nova aba imediatamente, o download ainda continuará
        // if (newWindow) {
        //     setTimeout(function() {
        //         newWindow.close();
        //     }, 500); // Fecha a aba após um curto período para garantir que o download comece
        // }
    });

});