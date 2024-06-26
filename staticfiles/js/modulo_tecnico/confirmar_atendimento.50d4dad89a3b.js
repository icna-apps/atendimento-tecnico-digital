document.addEventListener('DOMContentLoaded', function() {

    const idAtendimento = document.querySelector('#idAtendimentoTecnico').innerText

    //Abrir Offcanvas Confirmar Atendimento
    const abrirOffcanvasConfirmarAtendimento = document.querySelector("#abrirOffcanvasConfirmarAtendimento")
    const offcanvasConfirmarAtendimento = new bootstrap.Offcanvas("#offcanvasConfirmarAtendimento");
    abrirOffcanvasConfirmarAtendimento.addEventListener('click', function() {
        offcanvasConfirmarAtendimento.show()
    })


    $('#duracaoMinutos').mask('##');

    const duracaoMinutos = document.querySelector('#duracaoMinutos')
    duracaoMinutos.addEventListener('change', function() {
        let mensagem = ''

        if (duracaoMinutos.value == 0) {
            mensagem = '<span style="font-weight:normal"><b>Erro!</b><br>A duração não pode ser de<br> <b>0 minutos</b>.</span>'
        }

        if (duracaoMinutos.value > 60) {
            mensagem = '<span style="font-weight:normal;font-size: 1.5rem"><b>Erro!</b><br>A duração não pode ser superior a<br> <b>60 minutos</b>.</span>'
        }

        if (mensagem != '') {
            Swal.fire({
                title: mensagem,
                icon: 'error',
                iconColor: 'red',
                timer: 2750,
                showConfirmButton: false,
            });
            duracaoMinutos.value = ''
        }
    })

    const salvarConfirmacaoAtendimento = document.querySelector('#salvarConfirmacaoAtendimento')
    salvarConfirmacaoAtendimento.addEventListener('click', function(event) {
        event.preventDefault();
        confirmarAtendimento();
    })

    function confirmarAtendimento() {

        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificarCamposConfirmacaoAtendimento()
        if (preenchimento_incorreto === false) {
            return;
        }

        //Enviar para o backend
            //definir o caminho
            postURL = `/tecnico/atendimentos/atendimento/confirmar-atendimento/${idAtendimento}/`
    
            //pegar os dados
            let formData = new FormData(document.getElementById('formConfirmacaoAtendimento'));
    
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
                sweetAlert('<span style="font-weight:normal">Erro!<br> Confirmação de atendimento <b style="color:red">não realizada!</b></span>', 'error', 'red');
                throw new Error('Server response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.confirmado === "sim") {
                sweetAlert('<span style="font-weight:normal">Confirmação do atendimento realizada com <b style="color:green">sucesso!</b></span>', 'success', 'green');
                setTimeout(function() {
                    window.location.reload();
                }, 3000);
            } else {
                sweetAlert('<span style="font-weight:normal">Erro!<br> Confirmação de atendimento <b style="color:red">não realizada!</b></span>', 'error', 'red');
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
    }

    function verificarCamposConfirmacaoAtendimento() {
        const campos = [
            { id: 'id_imagem01', mensagem: 'Insira o <b>Comprovante do Atendimento</b>!' },
            { id: 'duracaoMinutos', mensagem: 'Informe a <b>Duração do Atendimento</b>!' },
            { id: 'formaAtendimento', mensagem: 'Informe a <b>Forma do Atendimento</b>!' },
            { id: 'internet_quality', mensagem: 'Avalie a <b>Qualidade da Conexão de Internet</b>!', tipo: 'radio' }
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