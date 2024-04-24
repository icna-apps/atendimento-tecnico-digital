document.addEventListener('DOMContentLoaded', () => {

  function updateSelectedCount() {
    const selectedCount = document.querySelectorAll('.horario-btn.ativo').length;
    const totalDisplay = document.querySelector('.placar__horarios');
    totalDisplay.textContent = `Total de Horários: ${selectedCount}/30`;
}

  // Função para contar quantos horários estão ativos em um dia específico
  function countActiveInDay(dayColumn) {
      return dayColumn.querySelectorAll('.horario-btn.ativo').length;
  }

  // Função para contar todos os horários ativos na semana
  function countAllActive() {
      return document.querySelectorAll('.horario-btn.ativo').length;
  }

  document.querySelectorAll('.horario-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Impede a seleção se o horário está indisponível
        if (this.classList.contains('indisponivel')) {
            sweetAlertPreenchimento({
                title: 'Atenção!',
                mensagem: '<p style="font-size: 1.25rem">Este horário não está disponível para seleção.</p>',
                iconColor: 'red'
            });
            return; // Retorna cedo para não executar o resto do código
        }

        const dayColumn = this.closest('td');  // Pega a coluna do dia (td) onde o botão está
        const activeCountDay = countActiveInDay(dayColumn);
        const totalActiveCount = countAllActive();
        
        if (this.classList.contains('ativo')) {
            // Se o botão já está ativo e está sendo clicado, desative-o
            this.classList.remove('ativo');
            this.classList.add('disponivel');  // Adiciona a classe 'disponivel' ao desativar
            updateSelectedCount();
        } else {
            // Se o botão não está ativo, verifique as condições antes de ativá-lo
            if (activeCountDay < 6 && totalActiveCount < 30) {
                this.classList.add('ativo');
                this.classList.remove('disponivel');  // Remove a classe 'disponivel' ao ativar
                updateSelectedCount();
            } else if (activeCountDay >= 6) {
                sweetAlertPreenchimento({
                    mensagem: '<p style="font-size: 1.25rem">Você pode selecionar até <b>6 horários por dia</b>.</p>',
                    iconColor: 'red'
                });
            } else if (totalActiveCount >= 30) {
                sweetAlertPreenchimento({
                    mensagem: '<p style="font-size: 1.25rem">Você pode selecionar até <b>30 horários por semana</b>.</p>',
                    iconColor: 'red'
                });
            }
        }
    });
});

  const horariosInicialmenteAtivos = new Set(Array.from(document.querySelectorAll('.horario-btn.ativo')).map(btn => btn.id));
  const botaoSalvar = document.querySelector("#botaoSalvarHorarios");
  botaoSalvar.addEventListener('click', function(event) {
        event.preventDefault();
        salvarHorarios(horariosInicialmenteAtivos);
  });

  function salvarHorarios(horariosInicialmenteAtivos) {
    const horariosAtualmenteAtivos = new Set(Array.from(document.querySelectorAll('.horario-btn.ativo')).map(btn => btn.id));
    const horariosParaDesmarcar = Array.from(horariosInicialmenteAtivos).filter(id => !horariosAtualmenteAtivos.has(id));
    
    fetch('tecnico/meushorarios/salvar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({
            horariosAtivos: Array.from(horariosAtualmenteAtivos),
            horariosDesmarcados: horariosParaDesmarcar
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();  // Só tenta converter para JSON se a resposta for 200 OK
        } else {
            throw new Error('Falha na requisição: ' + response.statusText);
        }
    })
    .then(data => {
        sweetAlertPreenchimento({
            html: `<p style="font-size: 1.25rem">${data.message}</p>`,
            iconColor: 'green',
            icon: 'success',
        });
        console.log('Sucesso:', data);
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
}
  

  
  
  updateSelectedCount();
});
