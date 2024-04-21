document.addEventListener('DOMContentLoaded', function() {

    //Verificar se há mensagem de salvamento com sucesso
    if (localStorage.getItem('confirmacaoCadastroCNAbr') === 'true') {
        sweetAlert('<span style="font-weight:normal">Cadastro CNA.BR realizado com <b style="color:green">sucesso!</b></span>', 'success', 'top-end');
        localStorage.removeItem('confirmacaoCadastroCNAbr');
    }

    $('#formCPF').mask('000.000.000-00');
    $('#formCelular').mask('(00) 00000-0000');

    const cpf = document.querySelector("#formCPF")
    cpf.addEventListener('change', async function() { // Marca a função como async

        if (this.value.length === 14) {
            const cpfValido = validaCPF(this.value);
            
            if (!cpfValido) {
                sweetAlert('CPF Inválido', 'error', 'red');
                this.value = '';
                return;
            }
    
            // Aguarda pela verificação do CPF e então processa a resposta
            const verificarCPFcadastrado = await procurarCNABR(this.value);
            if (verificarCPFcadastrado) {
                sweetAlert('CPF já cadastrado!', 'error', 'red');
                this.value = '';
                return;
            }
        }
    });
    

    async function procurarCNABR(cpf) {
        const url = `/procurar_cnabr/${cpf}/`;
        try {
            const response = await fetch(url); // Aguarda pela resposta
            const data = await response.json(); // Aguarda pela conversão da resposta para JSON
            return data.usuario; 
        } catch (error) {
            console.error('Erro ao procurar CNA.BR:', error);
            return false;
        }
    }
    

    const uf = document.querySelector("#uf")
    const municipio = document.querySelector('#municipio')
    const cod_ibge = document.querySelector('#formCodIBGE')
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


    const senha1 = document.querySelector('#formSenha1')
    const senha2 = document.querySelector('#formSenha2')

    senha1.addEventListener('change', function() {
        if (senha1.value.length < 6) {
            senha1.value = ''
            sweetAlert("<span style='font-weight: normal'>A senha deve conter, no mínimo, <b style='color:red'>6 caracteres</b>.</span>")
            return
        }

        if (senha1.value.split('').every(c => c === senha1.value.charAt(0))) {
            senha1.value = ''
            sweetAlert("<span style='font-weight: normal'>A senha não pode ser uma sequência de <b style='color:red'>valores repetidos</b>.</span>");
            return
        }
    })

    senha2.addEventListener('change', function() {
        if (senha1.value != senha2.value) {
            senha1.value = ''
            senha2.value = ''
            sweetAlert("<span style='font-weight: normal'>As senhas <b style='color:red'>não são iguais!<b></span>");
        }
    })


    const novoCNAbr = document.querySelector("#novoCNAbr")
    novoCNAbr.addEventListener('click', function(event) {
        event.preventDefault();
        realizarNovoCadastroCNABR();
    })

    function realizarNovoCadastroCNABR(){
        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificarCamposCNAbr()
        if (preenchimento_incorreto === false) {
            return;
        }
        
        //Enviar para o backend
            //definir o caminho
            postURL = '/cna-br/novo-cadastro/'
    
            //pegar os dados
            let formData = new FormData(document.getElementById('formNovoCNAbr'));
    
            //enviar 
            fetch(postURL, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
        
        //Retorno do Servidor
        .then(response => {
            // Primeiro verifique se a resposta é ok
            if (!response.ok) {
                sweetAlert('<span style="font-weight:normal">Cadastro <b style="color:red">não realizado!</b></span>', 'error', 'red');
                throw new Error('Server response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.retorno === "sucesso") {
                localStorage.setItem('confirmacaoCadastroCNAbr', 'true');
                window.location.reload();
            }
            if (data.retorno === "cadastro não realizado") {
                sweetAlert('<span style="font-weight:normal">Cadastro <b style="color:red">não realizado!</b></span>', 'error', 'red');
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });

    }

    function verificarCamposCNAbr() {
        const campos = [
            { id: 'formCPF', mensagem: 'Informe o CPF!' },
            { id: 'formNome', mensagem: 'Informe o Nome Completo!' },
            { id: 'formSexo', mensagem: 'Informe o Sexo!' },
            { id: 'formDataNascimento', mensagem: 'Informe a Data de Nascimento!' },
            { id: 'formCelular', mensagem: 'Informe o Celular!' },
            { id: 'formEmail', mensagem: 'Informe o Email!' },
            { id: 'uf', mensagem: 'Informe a UF!' },
            { id: 'municipio', mensagem: 'Informe o Município!' },
            { id: 'formSenha1', mensagem: 'Informe a senha!' },
            { id: 'formSenha2', mensagem: 'Confirme a senha!' },
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
            sweetAlertPreenchimento({mensagem})
            return false;
        }
    
        return true;
    }

});

