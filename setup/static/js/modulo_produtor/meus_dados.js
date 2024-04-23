document.addEventListener('DOMContentLoaded', function() {

    $('#formCelular').mask('(00) 00000-0000');
    $('#formDataNascimento').mask('00/00/0000');

    const formDataNascimento = document.querySelector('#formDataNascimento')
    formDataNascimento.addEventListener('change', function() {
        let dataInserida = formDataNascimento.value;
        let dataConvertida = Date.parse(dataInserida);
        if (!dataConvertida) {
            sweetAlert(
                tittle='Data de nascimento inválida!',
                icon='warning',
                iconColor='red',
            )
            formDataNascimento.value = '';
        }
    });


    const btnSalvar = document.querySelector('#btnSalvar')
    btnSalvar.addEventListener('click', function(event) {
        event.preventDefault();
        alert('teste')
    })

    function salvarDadosPessoais(){
        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificarCampos()
        if (preenchimento_incorreto === false) {
            return;
        }

        //Enviar para o backend
            //definir o caminho
            postURL = '/produtor/realizar-agendamento/'
    
            //pegar os dados
            let formData = new FormData(document.getElementById('formNovoAtendimento'));
    
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
                sweetAlert('<span style="font-weight:normal">Erro! Agendamento <b style="color:red">não realizado!</b></span>', 'error', 'red');
                throw new Error('Server response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.agendado === "sim") {
                const idAgendamento = data.id_agendamento;
                window.location.href = `/produtor/confirmacao-atendimento/${idAgendamento}/`;
            } else {
                sweetAlert('<span style="font-weight:normal">Erro! Agendamento <b style="color:red">não realizado!</b></span>', 'error', 'red');
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
    }


    function verificarCampos() {
        const campos = [
            { id: 'formDataNascimento', mensagem: 'Informe a <b>Atividade Produtiva</b>!' },
            { id: 'formCelular', mensagem: 'Informe o <b>Tópico do Atendimento</b>!' },
            { id: 'id_data', mensagem: 'Informe a <b>Data</b>!' },
            { id: 'id_hora', mensagem: 'Informe a <b>Hora</b>!' },
        ];
    
        let mensagensErro = campos.reduce((mensagens, campo) => {
            const elemento = document.getElementById(campo.id);
            if (!elemento || elemento.value === '') {
                mensagens.push(campo.mensagem);
            }
            return mensagens;
        }, []);
    
        if (mensagensErro.length > 0) {
            const mensagem = mensagensErro.join('<br>')
            sweetAlertPreenchimento({ mensagem })
            return false;
        }
    
        return true;
    }


});

