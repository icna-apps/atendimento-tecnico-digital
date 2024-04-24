document.addEventListener('DOMContentLoaded', function() {

    const abrirOffcanvasWhatsapp = document.querySelector("#abrirOffcanvasWhatsapp")
    const offcanvasWhatsapp = new bootstrap.Offcanvas("#offcanvasWhatsapp");
    abrirOffcanvasWhatsapp.addEventListener('click', function() {
        
        offcanvasWhatsapp.show()
    })

    const iniciarAtendimento = document.querySelector('#iniciarAtendimento')
    iniciarAtendimento.addEventListener('click', function(){
        let celular = iniciarAtendimento.getAttribute('data-id')
        celular = celular.replace(/[^\d]/g, '') 

        const url = 'https://api.whatsapp.com/send?phone=55' + celular;
            
        window.open(url, '_blank');
    })

    const copiarMensagemInicial = document.querySelector('#copiarMensagemInicial');
const mensagemInicial = document.querySelector('#mensagemInicial');
const iconeCopiar = copiarMensagemInicial.querySelector('.material-symbols-outlined');

copiarMensagemInicial.addEventListener('click', function() {
    // Criar um range e selecionar o texto da div
    const range = document.createRange();
    const selection = window.getSelection();
    selection.removeAllRanges(); // Limpa seleções prévias
    range.selectNodeContents(mensagemInicial);
    selection.addRange(range);

    // Tenta copiar o texto selecionado para a área de transferência
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            // Altera o ícone para 'done'
            iconeCopiar.textContent = 'done';
            // Define um timeout para voltar ao ícone original após 5 segundos
            setTimeout(() => {
                iconeCopiar.textContent = 'content_copy';
            }, 750);
        } else {
            console.error('Falha ao copiar texto.');
        }
    } catch (err) {
        console.error('Erro ao copiar texto: ', err);
    }

    // Limpa a seleção
    selection.removeAllRanges();
});


});