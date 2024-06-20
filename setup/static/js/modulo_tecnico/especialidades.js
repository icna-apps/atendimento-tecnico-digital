document.addEventListener('DOMContentLoaded', function() {

    const idUsuario = document.querySelector('#idUsuario').innerText

    const botaoSalvarEspecialidades = document.querySelector('#btnSalvarEspecialidades')
    botaoSalvarEspecialidades.addEventListener('click', function(event){
        event.preventDefault();
        alert('ID do Usuário: ' + idUsuario)
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

    
    
});