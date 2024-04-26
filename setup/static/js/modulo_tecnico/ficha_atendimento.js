document.addEventListener('DOMContentLoaded', function() {

    const idAtendimento = document.querySelector('#idAtendimentoTecnico').innerText

    var editorDiv = document.getElementById('editor');
    var quill = new Quill(editorDiv, {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                [{'list': 'ordered'}, {'list': 'bullet'}, 'link'],
                ['clean']
            ]
        }
    });

    // Carregar o conteúdo inicial no Quill
    var conteudoInicial = document.getElementById('relatorioInicial').textContent;
    
    // Usar dangerouslyPasteHTML para evitar problemas com tags extras como <p></p>
    quill.clipboard.dangerouslyPasteHTML(conteudoInicial);


    var editor = document.getElementById('editor');
    var wordCountSpan = document.getElementById('contadorPalavras');

    function updateWordCount() {
        var text = editor.innerText.trim();
        var words = text.length > 0 ? text.match(/\S+/g).length : 0;
        wordCountSpan.textContent = 'Total de palavras: ' + words;
    }

    editor.addEventListener('input', function() {
        updateWordCount();
    });
    // Inicializa a contagem de palavras ao carregar a página
    updateWordCount();




    //Abrir Offcanvas Whatsapp
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

    // Mensagem inicial
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


    // Mensagem final
    const copiarMensagemFinal = document.querySelector('#copiarMensagemFinal');
    const mensagemFinal = document.querySelector('#mensagemFinal');
    const iconeCopiarFinal = copiarMensagemFinal.querySelector('#botaoFinal');

    copiarMensagemFinal.addEventListener('click', function() {
        // Criar um range e selecionar o texto da div
        const range = document.createRange();
        const selection = window.getSelection();
        selection.removeAllRanges(); // Limpa seleções prévias
        range.selectNodeContents(mensagemFinal);
        selection.addRange(range);

        // Tenta copiar o texto selecionado para a área de transferência
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                // Altera o ícone para 'done'
                iconeCopiarFinal.textContent = 'done';
                // Define um timeout para voltar ao ícone original após 5 segundos
                setTimeout(() => {
                    iconeCopiarFinal.textContent = 'content_copy';
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


    const btnSalvarRelatorio = document.querySelector("#btnSalvarRelatorio")

    btnSalvarRelatorio.addEventListener('click', function(event) {
        event.preventDefault();
        salvarRelatorio();
    })

    function salvarRelatorio() {
    
        const conteudoTexto = quill.getText().trim();
        if (conteudoTexto === '' || /^\s*$/.test(conteudoTexto)) {
            Swal.fire({
                title: '<span style="font-weight:normal"><b>O relatório está vazio.</b><br>Por favor, insira algum conteúdo.</span>',
                icon: 'warning',
                iconColor: 'red',
            });
            return; // Parar execução se estiver vazio
        }
    
        const editor = document.querySelector('#editor');
        const id = editor.getAttribute('data-id');
        const postURL = `/tecnico/atendimentos/atendimento/salvar-relatorio/${id}/`;

        let relatorio = quill.root.innerHTML.trim();
    
        // Enviar os dados
        fetch(postURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ relatorio: relatorio })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Server response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.salvo === "sim") {

                document.getElementById('dataRelatorio').innerHTML = 'Última atualização:&nbsp;' + data.dataRelatorio;

                Swal.fire({
                    title: '<span style="font-weight:normal">Relatório salvo com <b>sucesso!</b></span>',
                    icon: 'success',
                    iconColor: 'green',
                    timer: 2500,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    title: '<span style="font-weight:normal"><b>Erro!</b><br>O relatório não foi salvo.</span>',
                    icon: 'error',
                    iconColor: 'red',
                    timer: 2500,
                    showConfirmButton: false,
                });
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
    }
    

    //Cancelar atendimento
    const abrirOffcanvasCancelarAtendimento = document.querySelector("#abrirOffcanvasCancelarAtendimento")
    const offcanvasCancelarAtendimento = new bootstrap.Offcanvas("#offcanvasCancelarAtendimento")
    abrirOffcanvasCancelarAtendimento.addEventListener('click', function() {
        offcanvasCancelarAtendimento.show()
    })

    const cancelamentoMotivo = document.querySelector('#cancelamentoMotivo');
    const cancelamentoImagem = document.querySelector('#cancelamentoImagem');
    cancelamentoMotivo.addEventListener('change', function() {
        if (cancelamentoMotivo.value === 'produtor_nao_compareceu') {
            cancelamentoImagem.style.display = 'block'; // Usar 'block' para mostrar
        } else {
            cancelamentoImagem.style.display = 'none'; // Usar 'none' para esconder
        }
    });

    const botaoCancelarAtendimento = document.querySelector('#botaoCancelarAtendimento')
    botaoCancelarAtendimento.addEventListener('click', function(event){
        event.preventDefault();
        alert('Cancelar atendimento')
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
            } else {
                sweetAlert('<span style="font-weight:normal">Erro!<br> Confirmação de atendimento <b style="color:red">não realizada!</b></span>', 'error', 'red');
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
    }

    function verificarCamposCancelarAtendimento() {
        const campos = [
            { id: 'cancelamentoMotivo', mensagem: 'Informe o <b>Motivo do Cancelamento</b>!' },
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
    




    //Finalizar atendimento
    const abrirOffcanvasFinalizarAtendimento = document.querySelector("#abrirOffcanvasFinalizarAtendimento")
    const offcanvasFinalizarAtendimento = new bootstrap.Offcanvas("#offcanvasFinalizarAtendimento")
    abrirOffcanvasFinalizarAtendimento.addEventListener('click', function() {

        const relatorio = quill.getText().trim();
        const finalizarRelatorioAtendimento = document.querySelector('#finalizarRelatorioAtendimento')

        let texto = editor.innerText.trim();
        let palavras = texto.length > 0 ? texto.match(/\S+/g).length : 0;

        if (palavras > 100 && palavras < 500) {
            finalizarRelatorioAtendimento.innerHTML = '<span class="material-symbols-outlined" style="font-size: 4vh; color: green;">check_circle</span> Relatório do atendimento';
        } else {
            finalizarRelatorioAtendimento.innerHTML = '<span class="material-symbols-outlined" style="font-size: 4vh; color: red;">error</span> Relatório do atendimento';
        }

        offcanvasFinalizarAtendimento.show()
    })


    //Agendar retorno
    const abrirOffcanvasAgendarRetorno = document.querySelector("#abrirOffcanvasAgendarRetorno")
    const offcanvasAgendarRetorno = new bootstrap.Offcanvas("#offcanvasAgendarRetorno")
    abrirOffcanvasAgendarRetorno.addEventListener('click', function() {
        offcanvasAgendarRetorno.show()
    })

    
});