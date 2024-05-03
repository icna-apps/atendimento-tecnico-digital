document.addEventListener('DOMContentLoaded', function() {

    const cards = document.querySelectorAll('.listagem_item');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const atendimentoId = this.getAttribute('data-id');
            window.location.href = `/tecnico/atendimentos/atendimento/${atendimentoId}/`
        });
    });



    //Filtros
    const filtroStatus = document.querySelector('#filtroStatus')
    const filtroAtividade = document.querySelector('#filtroAtividade')
    const filtroTopico = document.querySelector('#filtroTopico')
    const filtroNotaAvaliacao = document.querySelector('#filtroNotaAvaliacao')
    const filtroProdutor = document.querySelector('#filtroProdutor')
    const botaoLimparFiltros = document.querySelector('#botaoLimparFiltros')

    //Limpar Filtros
    botaoLimparFiltros.addEventListener('click', function() {
        filtroStatus.value = null
        filtroAtividade.value = null
        filtroTopico.value = null
        filtroNotaAvaliacao.value = null
        filtroProdutor.value = null

        filtrarAtendimentos();
    })

    //Filtrar
    $('#filtroStatus, #filtroAtividade, #filtroTopico, #filtroNotaAvaliacao').change(function() {
        filtrarAtendimentos();
    });

    $('#filtroProdutor').keyup(function() {
        filtrarAtendimentos();
    });

    //Filtrar
    function filtrarAtendimentos() {
        var status = filtroStatus.value;
        var atividade = filtroAtividade.value;
        var topico = filtroTopico.value;
        var notaAvaliacao = filtroNotaAvaliacao.value;
        var produtor = filtroProdutor.value;

        var dataToSend = {
            'status': status,
            'atividade': atividade,
            'topico': topico,
            'notaAvaliacao': notaAvaliacao,
            'produtor': produtor,
        };


        $.ajax({
            url: "/tecnico/atendimentos/filtro/",
            data: { ...dataToSend },
            dataType: 'json',
            success: function(data) {
                recarregarAtendimentos(data.data);
            },
            error: function(xhr, status, error) {
                console.log("Erro ao receber dados: ", error);
            }
        });
    }

    function recarregarAtendimentos(atendimentos) {
        const container = document.querySelector('.container_listagem');
        container.innerHTML = ''; // Limpa o conteúdo existente
    
        atendimentos.forEach(atendimento => {
            // Determina o ícone e a cor baseado no status
            let icone, corStatus, descricaoStatus = atendimento.status; // Assumindo que status já é a descrição.
            switch(atendimento.status) {
                case 'Agendado':
                    icone = 'event';
                    corStatus = 'var(--agendado)';
                    break;
                case 'Cancelado':
                    icone = 'event_busy';
                    corStatus = 'var(--cancelado)';
                    break;
                case 'Atendido':
                    icone = 'event_available';
                    corStatus = 'var(--atendido)';
                    break;
                case 'Finalizado':
                    icone = 'done_all';
                    corStatus = 'var(--finalizado)';
                    break;
            }
    
            const divItem = document.createElement('div');
            divItem.className = 'listagem_item';
            divItem.setAttribute('data-id', atendimento.id);
    
            divItem.innerHTML = `
                <div class="listagem_item_icone">
                    <i class="material-symbols-outlined" style="font-size: 3vw; color: ${corStatus}">${icone}</i>
                    <span style="color: ${corStatus}; font-weight: bold;">${descricaoStatus}</span>
                </div>
                <div class="listagem_item_informacoes">
                    <span class="listagem_item_informacoes_titulo"><b>Atendimento ${atendimento.id}</b></span>
                    <div class="listagem_item_informacoes_container">
                        <div class="listagem_item_informacoes_container_parte">
                            <span>Data/Hora: <b>${atendimento.data} - ${atendimento.hora}</b></span>
                            <span>Atividade: ${atendimento.atividade}</span>
                            <span>Tópico: ${atendimento.topico}</span>
                        </div>
                        <div class="listagem_item_informacoes_container_parte">
                            <span>Status: ${descricaoStatus}</span>
                            <span>Substatus: ${atendimento.substatus}</span>
                            <span>Nota de Avaliação: ${atendimento.notaAvaliacao || '-'}</span>
                        </div>
                        <div class="listagem_item_informacoes_container_parte">
                            <span>Produtor: <b>${atendimento.produtor}</b></span>
                            <span>Idade: ${atendimento.idade} anos</span>
                            <span>Município: ${atendimento.municipio}</span>
                        </div>
                    </div>
                </div>
            `;
    
            // Adiciona o novo divItem ao contêiner
            container.appendChild(divItem);
        });
    }
    
    
    

});