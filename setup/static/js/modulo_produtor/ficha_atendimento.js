document.addEventListener('DOMContentLoaded', function() {

    // const navbar = document.querySelector('#navbar')
    // navbar.style.display = 'none';

    const btnSair = document.querySelector('#btnSair')
    btnSair.addEventListener('click', function(){
        window.location.href='/produtor/meus-atendimentos/'
    })

    const cardAtendimento = document.getElementById('cardAtendimento');
    const atendimentoId = cardAtendimento.getAttribute('data-id');

    const btnCancelar = document.querySelector('#btnCancelar')
    if (btnCancelar) {
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
    }
    

    const btnAvaliarAtendimento = document.querySelector('#btnAvaliarAtendimento')
    if (btnAvaliarAtendimento) {
        btnAvaliarAtendimento.addEventListener('click', function(){    
            const nota = notaEstrelas()
            if (nota == 0) {
                sweetAlert('<span style="font-weight:normal"><b>Erro!</b><br> Selecione entre 1 a 5 estrelas!</span>', 'error', 'red');
                return
            }
            sweetAlertConfirmacaoAvaliacao(
                tittle = "Atenção!",
                text = "Deseja confirma essa avaliação?",
                textoConfirmacao = "Sim, avaliar",
                textoCancelar = "Cancelar",
                url = `/produtor/ficha-atendimento/avaliar/${atendimentoId}/${nota}/`,
                csrfToken = getCSRFToken(),
                url_apos = `/produtor/ficha-atendimento/${atendimentoId}/`,
            )
        })    
    }
    
   
    function notaEstrelas() {
        const estrelas = document.querySelectorAll('.estrelas input[type="radio"]');
        let maxRating = 0;

        estrelas.forEach(function(estrela) {
            if (estrela.checked) {
                const currentValue = parseInt(estrela.value, 10);
                if (currentValue > maxRating) {
                    maxRating = currentValue;
                }
            }
        });

        return maxRating;
    }
    

    const btnRelatorio = document.querySelector('#btnRelatorio');
    if (btnRelatorio){
        btnRelatorio.addEventListener('click', function(event) {
            event.preventDefault();
            var newWindow = window.open(`/relatorio-atendimento/${atendimentoId}`, '_blank');
        });
    }
    

    //Modal imagem
    const modalImagem = new bootstrap.Modal(document.getElementById('modalImagem'));
    const modalImagemContent = document.getElementById('modalImagemContent');
    
    const cards = document.querySelectorAll('.imagens_enviadas__card');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const img = card.querySelector('img');
            if (img) {
                modalImagemContent.src = img.src;
                modalImagem.show();
            }
        });
    });

});