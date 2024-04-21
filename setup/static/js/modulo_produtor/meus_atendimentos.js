document.addEventListener('DOMContentLoaded', function() {

    const cardAgendamento = document.getElementById('cardAgendamento');
    const agendamentoId = cardAgendamento.getAttribute('data-id');

    cardAgendamento.addEventListener('click', function(){
        url = `/produtor/ficha-atendimento/${agendamentoId}/`
        window.location.href = `/produtor/ficha-atendimento/${agendamentoId}/`
    })


});