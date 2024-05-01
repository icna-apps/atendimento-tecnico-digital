document.addEventListener('DOMContentLoaded', function() {

    const idAtendimento = document.querySelector('#idAtendimentoTecnico').innerText
    const finalizarConfirmacaoAtendimento = document.querySelector('#finalizarConfirmacaoAtendimento')
    const finalizarRelatorioAtendimento = document.querySelector('#finalizarRelatorioAtendimento')

    const botaoFinalizarAtendimento = document.querySelector('#botaoFinalizarAtendimento')
    botaoFinalizarAtendimento.addEventListener('click', function(event){
        event.preventDefault();
        finalizarAtendimento();
    })

    function finalizarAtendimento() {

        const iconeConfirmacao = finalizarConfirmacaoAtendimento.querySelector('.material-symbols-outlined').textContent
        const iconeRelatorio = finalizarRelatorioAtendimento.querySelector('.material-symbols-outlined').textContent

        if (iconeConfirmacao != 'check_circle') {
            Swal.fire({
                title: '<span style="font-weight:normal">Confirme o atendimento!<br> <b>Atendimento não finalizado.</b></span>',
                icon: 'warning',
                iconColor: 'orange',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }
        if (iconeRelatorio != 'check_circle') {
            Swal.fire({
                title: '<span style="font-weight:normal">O relatório deve ter entre 100 e 500 palavras!<br> <b>Atendimento não finalizado.</b></span>',
                icon: 'warning',
                iconColor: 'orange',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }
              
        //Enviar para o backend
            //definir o caminho
            postURL = `/tecnico/atendimentos/atendimento/finalizar/${idAtendimento}/`
    
            //enviar 
            fetch(postURL, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCSRFToken(),
                }
            })
        
        //Retorno do Servidor
        .then(response => {
            if (!response.ok) {
                sweetAlert('<span style="font-weight:normal">Erro!<br> <b style="color:red">Atendimento não finalizado!</b></span>', 'error', 'red');
                throw new Error('Server response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.finalizado === "sim") {
                sweetAlert('<span style="font-weight:normal">Atendimento finalizado com <b style="color:green">sucesso!</b></span>', 'success', 'green');
                setTimeout(function() {
                    window.location.reload();
                }, 3000);
            } else {
                sweetAlert('<span style="font-weight:normal">Erro!<br> <b style="color:red">Atendimento não finalizado!</b></span>', 'error', 'red');
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
    }

    
    
});