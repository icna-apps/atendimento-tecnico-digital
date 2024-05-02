document.addEventListener('DOMContentLoaded', function() {

    const idAtendimento = document.querySelector('#idAtendimentoTecnico').innerText

    var editorDiv = document.getElementById('editor');
    var elementoStatus = document.getElementById('statusAtendimento');
    var status = elementoStatus.getAttribute('data-status');
    var statusRelatorio = status === 'finalizado' ? true : false;

    var quill = new Quill(editorDiv, {
        theme: 'snow',
        readOnly: statusRelatorio,
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                [{'list': 'ordered'}, {'list': 'bullet'}, 'link'],
                ['clean']
            ]
        }
    });

    // Carregar o conteúdo inicial no Quill
    const conteudoInicial = document.getElementById('relatorioInicial').textContent;
    
    // Usar dangerouslyPasteHTML para evitar problemas com tags extras como <p></p>
    quill.clipboard.dangerouslyPasteHTML(conteudoInicial);


    var editor = document.getElementById('editor');
    var wordCountSpan = document.getElementById('contadorPalavras');

    function updateWordCount() {
        var text = editor.innerText.trim();
        var words = text.length > 0 ? text.match(/\S+/g).length : 0;
        wordCountSpan.textContent = 'Total de palavras: ' + words + "/100-500";
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
    if(btnSalvarRelatorio){
        btnSalvarRelatorio.addEventListener('click', function(event) {
            event.preventDefault();
            salvarRelatorio();
            ativarFinalizarRelatorio()
        })
    }
    

    function salvarRelatorio() {
    
        const conteudoTexto = quill.getText().trim();
        if (conteudoTexto === '' || /^\s*$/.test(conteudoTexto)) {
            Swal.fire({
                title: '<span style="font-weight:normal"><b>O relatório está vazio.</b><br>Por favor, insira algum conteúdo.</span>',
                icon: 'warning',
                iconColor: 'orange',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }

        if (conteudoTexto.replace(/\s+/g, '') == conteudoInicial.replace(/<[^>]*>/g, '').replace(/\s+/g, '')) {
            Swal.fire({
                title: '<span style="font-weight:normal">Não houve alterações.<br> <b>Não foi salvo.</b></span>',
                icon: 'warning',
                iconColor: 'orange',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            return;
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

    ativarFinalizarRelatorio()

    function ativarFinalizarRelatorio() {
        const finalizarRelatorioAtendimento = document.querySelector('#finalizarRelatorioAtendimento')

        let texto = editor.innerText.trim();
        let palavras = texto.length > 0 ? texto.match(/\S+/g).length : 0;

        if (palavras > 100 && palavras < 500) {
            finalizarRelatorioAtendimento.innerHTML = '<span class="material-symbols-outlined" style="font-size: 3vh; color: green;">check_circle</span> Relatório do atendimento';
        } else {
            finalizarRelatorioAtendimento.innerHTML = '<span class="material-symbols-outlined" style="font-size: 3vh; color: red;">error</span> Relatório do atendimento';
        }
    }

    const btnGerarRelatorio = document.querySelector('#btnGerarRelatorio');
    btnGerarRelatorio.addEventListener('click', function(event) {
        event.preventDefault();

        // Abre a URL em uma nova aba
        var newWindow = window.open(`/relatorio-atendimento/${idAtendimento}`, '_blank');
        // Fecha a nova aba imediatamente, o download ainda continuará
        // if (newWindow) {
        //     setTimeout(function() {
        //         newWindow.close();
        //     }, 500); // Fecha a aba após um curto período para garantir que o download comece
        // }
    });

    

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



    
    




    //Finalizar atendimento
    const abrirOffcanvasFinalizarAtendimento = document.querySelector("#abrirOffcanvasFinalizarAtendimento")
    const offcanvasFinalizarAtendimento = new bootstrap.Offcanvas("#offcanvasFinalizarAtendimento")
    abrirOffcanvasFinalizarAtendimento.addEventListener('click', function() {

        const relatorio = quill.getText().trim();
        

        offcanvasFinalizarAtendimento.show()
    })


    //Agendar retorno
    const abrirOffcanvasAgendarRetorno = document.querySelector("#abrirOffcanvasAgendarRetorno")
    const offcanvasAgendarRetorno = new bootstrap.Offcanvas("#offcanvasAgendarRetorno")
    abrirOffcanvasAgendarRetorno.addEventListener('click', function() {
        offcanvasAgendarRetorno.show()
    })

    
});