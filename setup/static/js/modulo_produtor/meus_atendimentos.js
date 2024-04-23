document.addEventListener('DOMContentLoaded', function() {

    const cardAgendamento = document.getElementById('cardAgendamento');
    if (cardAgendamento) {
        const agendamentoId = cardAgendamento.getAttribute('data-id');
    
        cardAgendamento.addEventListener('click', function(){
            window.location.href = `/produtor/ficha-atendimento/${agendamentoId}/`
        });
    }

    const cards = document.querySelectorAll('.card-atendimento');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const atendimentoId = this.getAttribute('data-id');
            window.location.href = `/produtor/ficha-atendimento/${atendimentoId}/`
        });
    });


});