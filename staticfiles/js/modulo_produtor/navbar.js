document.addEventListener('DOMContentLoaded', function() {
    
    //Componentes
    const path = window.location.pathname;
    const abaAtendimentos = document.querySelector('#abaAtendimentos');
    const abaInformacoes = document.querySelector('#abaInformacoes')
    const abaMeusDados = document.querySelector('#abaMeusDados')

    //URLS
    const urlAtendimentos = '/produtor/meus-atendimentos/'
    const urlInformacoes = '/produtor/informacoes/'
    const urlMeusDados = '/produtor/meus-dados/'

    //Abas - verificar URL para colorir
    if (path === urlAtendimentos) {
        abaAtendimentos.classList.add('active');
    }
    if (path.includes(urlInformacoes)) {
        abaInformacoes.classList.add('active');
    }
    if (path.includes(urlMeusDados)) {
        abaMeusDados.classList.add('active');
    }

    //Navegação
    abaAtendimentos.addEventListener('click', function() {
        window.location.href = urlAtendimentos
    })
    abaInformacoes.addEventListener('click', function() {
        window.location.href = urlInformacoes
    })
    abaMeusDados.addEventListener('click', function() {
        window.location.href = urlMeusDados
    })

    function removerActiveAbas() {
        abaAtendimentos.classList.remove('active')
        abaInformacoes.classList.remove('active')
        abaMeusDados.classList.remove('active')
    }


});




