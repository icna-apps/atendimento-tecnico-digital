document.addEventListener('DOMContentLoaded', function() {

    const cards = document.querySelectorAll('.listagem_item');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const atendimentoId = this.getAttribute('data-id');
            window.location.href = `/tecnico/atendimentos/atendimento/${atendimentoId}/`
        });
    });


});