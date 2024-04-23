document.addEventListener('DOMContentLoaded', function() {

    //Verificar se há mensagem de salvamento com sucesso
    if (localStorage.getItem('confirmacaoAlteracao') === 'true') {
        sweetAlert('<span style="font-weight:normal">Alterações realizadas com <b style="color:green">sucesso!</b></span>', 'success', 'top-end');
        localStorage.removeItem('confirmacaoAlteracao');
    }

    $('#formCelular').mask('(00) 00000-0000');
    $('#formDataNascimento').mask('00/00/0000');

    const formNomeCompleto = document.querySelector('#formNomeCompleto')
    formNomeCompleto.addEventListener('change', function() {
        if (formNomeCompleto.value.length < 10) {
            sweetAlert(
                tittle='Informe o seu Nome Completo!',
                icon='warning',
                iconColor='red',
            )
            formNomeCompleto.value = '';
        }
    });

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
        salvarDadosPessoais();
    })

    function salvarDadosPessoais(){
        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificarCampos()
        if (preenchimento_incorreto === false) {
            return;
        }

        //Enviar para o backend
            //definir o caminho
            postURL = '/produtor/meus-dados/alterar/'
    
            //pegar os dados
            let formData = new FormData(document.getElementById('formDadosUsuario'));
    
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
                sweetAlert('<span style="font-weight:normal">Erro! Alterações <b style="color:red">não realizadas!</b></span>', 'error', 'red');
                throw new Error('Server response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.alterado === "sim") {
                localStorage.setItem('confirmacaoAlteracao', 'true');
                window.location.href = `/produtor/meus-dados/`;
            } else {
                sweetAlert('<span style="font-weight:normal">Erro! Alterações <b style="color:red">não realizadas!</b></span>', 'error', 'red');
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
    }


    function verificarCampos() {
        const campos = [
            { id: 'formNomeCompleto', mensagem: 'Informe o seu <b>Nome Completo</b>!'},
            { id: 'formDataNascimento', mensagem: 'Informe a sua <b>Data de Nascimento</b>!' },
            { id: 'formCelular', mensagem: 'Informe o seu <b>Whatsapp</b>!' },
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

