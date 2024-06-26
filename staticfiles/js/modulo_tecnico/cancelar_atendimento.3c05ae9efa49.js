document.addEventListener('DOMContentLoaded', function() {

    const idAtendimento = document.querySelector('#idAtendimentoTecnico').innerText

    const botaoCancelarAtendimento = document.querySelector('#botaoCancelarAtendimento')
    botaoCancelarAtendimento.addEventListener('click', function(event){
        event.preventDefault();
        cancelarAtendimento();
    })

    function cancelarAtendimento() {

        

        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificarCamposCancelarAtendimento()
        if (preenchimento_incorreto === false) {
            return;
        }

        
        //Enviar para o backend
            //definir o caminho
            postURL = `/tecnico/atendimentos/atendimento/cancelar-atendimento/${idAtendimento}/`

            //pegar os dados
            let formData = new FormData(document.getElementById('formCancelamentoAtendimento'));
    
            //enviar 
            fetch(postURL, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCSRFToken(),
                }
            })
        
        //Retorno do Servidor
        .then(response => {
            if (!response.ok) {
                sweetAlert('<span style="font-weight:normal">Erro!<br> Cancelamento do atendimento <b style="color:red">não realizado!</b></span>', 'error', 'red');
                throw new Error('Server response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.cancelado === "sim") {
                sweetAlert('<span style="font-weight:normal">Cancelamento do atendimento realizado com <b style="color:green">sucesso!</b></span>', 'success', 'green');
                setTimeout(function() {
                    window.location.reload();
                }, 3000);
            } else {
                sweetAlert('<span style="font-weight:normal">Erro!<br> Cancelamento do atendimento <b style="color:red">não realizado!</b></span>', 'error', 'red');
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
    }

    function verificarCamposCancelarAtendimento() {
        const campos = [
            { id: 'cancelamentoMotivo', mensagem: 'Informe o <b>Motivo do Cancelamento</b>!' },
            { id: 'cancelamentoObservacoes', mensagem: 'Informe a <b>Justificativa do Cancelamento</b>!' },
        ];
    
        let mensagensErro = campos.reduce((mensagens, campo) => {
            const elemento = document.getElementById(campo.id);
            if (campo.tipo === 'radio') {
                // Verifica se algum rádio está selecionado
                const selecionado = document.querySelector(`input[name="${campo.id}"]:checked`);
                if (!selecionado) {
                    mensagens.push(campo.mensagem);
                }
            } else if (!elemento || elemento.value === '') {
                mensagens.push(campo.mensagem);
            }
            return mensagens;
        }, []);
    
        if (mensagensErro.length > 0) {
            const mensagem = mensagensErro.join('<br>');
            sweetAlertPreenchimento({ mensagem });
            return false;
        }
    
        return true;
    }
    
});