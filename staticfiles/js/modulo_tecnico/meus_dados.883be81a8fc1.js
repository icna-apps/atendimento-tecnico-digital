document.addEventListener('DOMContentLoaded', function() {

    $('#cpf').mask('000.000.000-00');
    $('#celular').mask('(00) 00000-0000');
    $('#cnpj').mask('00.000.000/0000-00')

    const uf = document.querySelector("#uf")
    const municipio = document.querySelector('#municipio')
    const cod_ibge = document.querySelector('#codIBGE')
    uf.addEventListener('change', function(){
        
        if (uf.value == ''){
            municipio.setAttribute('disabled', 'disabled')
            municipio.value = ''
            cod_ibge.value = ''
        } else {
            municipio.removeAttribute('disabled')
            cod_ibge.value = ''
            buscarMunicipios(uf.value, '#municipio')
        }
    })

    municipio.addEventListener('change', function(){
        cod_ibge.value = municipio.value
    })


    const btnSalvar = document.querySelector('#btnSalvar')
    btnSalvar.addEventListener('click', function(event){
        event.preventDefault();
        salvarMeusDados();
    })

    function salvarMeusDados() {

        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificarCamposMeusDados()
        if (preenchimento_incorreto === false) {
            return;
        }

        //Enviar para o backend
            //definir o caminho
            postURL = `/tecnico/meusdados/atualizar/`
    
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
                sweetAlert('<span style="font-weight:normal">Erro!<br> <b style="color:red">Dados não foram salvos!</b></span>', 'error', 'red');
                throw new Error('Server response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.atualizado === "sim") {
                sweetAlert('<span style="font-weight:normal">Dados atualizados com <b style="color:green">sucesso!</b></span>', 'success', 'green');
                // setTimeout(function() {
                //     window.location.reload();
                // }, 3000);
            } else {
                sweetAlert('<span style="font-weight:normal">Erro!<br> <b style="color:red">Dados não foram salvos!</b></span>', 'error', 'red');
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
    }

    function verificarCamposMeusDados() {
        const campos = [
            { id: 'cpf', mensagem: 'Informe o <b>CPF</b>!' },
            { id: 'nomeCompleto', mensagem: 'Informe o <b>Nome Completo</b>!' },
            { id: 'dataNascimento', mensagem: 'Informe a <b>Data de Nascimento</b>!' },
            { id: 'codIBGE', mensagem: 'Informe a <b>UF e Município</b>!'},
            { id: 'celular', mensagem: 'Informe o <b>Celular</b>!'},
            { id: 'email', mensagem: 'Informe a <b>Email</b>!'}
        ];
    
        let mensagensErro = campos.reduce((mensagens, campo) => {
            const elemento = document.getElementById(campo.id);
            if (!elemento || elemento.value === '') {
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

    

    const cnpj = document.querySelector('#cnpj')
    const razaoSocial = document.querySelector('#razaoSocial')
    cnpj.addEventListener('change', async function() {
        
        let cnpj_numeros = cnpj.value.replace(/[./-]/g, "")
        let cnpj_validacao = validaCNPJ(cnpj.value) 

        if (!cnpj_validacao) {

            sweetAlert(
                '<span style="font-weight:normal">Erro!<br> <b style="color:red">CNPJ inválido!</b></span>', 
                'error', 'red'
            );
            cnpj.value = ''
            razaoSocial.value = ''
            razaoSocial.setAttribute('readonly', 'true')

        } else {

            const dadosCNPJ = await consultarCNPJ(cnpj_numeros);
            if (dadosCNPJ) {
                $('#razaoSocial').val(dadosCNPJ)
            } else {
                razaoSocial.value = ''
                razaoSocial.removeAttribute('readonly')

            }
        }
    })



    const bancoNome = document.querySelector('#bancoNome')
    const bancoCodigo = document.querySelector('#bancoCodigo')
    bancoNome.addEventListener('change', function() {
        bancoCodigo.value = bancoNome.value
    })



    //Abrir Offcanvas Especialidade
    const abrirOffcanvasEspecialidade = document.querySelector("#botaoAddEspecialidade")
    const offcanvasEspecialidade = new bootstrap.Offcanvas("#offcanvasEspecialidade");
    abrirOffcanvasEspecialidade.addEventListener('click', function() {
        offcanvasEspecialidade.show()
    })

});

