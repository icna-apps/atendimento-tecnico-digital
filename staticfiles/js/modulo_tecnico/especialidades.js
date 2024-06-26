document.addEventListener('DOMContentLoaded', function() {

    const idUsuario = document.querySelector('#idUsuario').innerText

    const botaoSalvarEspecialidades = document.querySelector('#btnSalvarEspecialidades')
    botaoSalvarEspecialidades.addEventListener('click', function(event){
        event.preventDefault();
        salvarEspecialidades()
    })

    function salvarEspecialidades() {

        //Especialidades selecionadas
        var especialidadesSelecionadas = [];
        var checkboxes = document.querySelectorAll('#formEspecialidades .form-check-input');

        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                especialidadesSelecionadas.push(checkbox.value);
            }
        });
        
        //Enviar para o backend
            //definir o caminho
            postURL = `/tecnico/meusdados/especialidades/`

    
            //enviar 
            fetch(postURL, {
                method: 'POST',
                body: JSON.stringify({ especialidades: especialidadesSelecionadas }),
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCSRFToken(),
                }
            })
        
        //Retorno do Servidor
        .then(response => {
            if (!response.ok) {
                sweetAlert('<span style="font-weight:normal">Erro!<br>Especialidades <b style="color:red">não salvas!</b></span>', 'error', 'red');
                throw new Error('Server response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                sweetAlert('<span style="font-weight:normal">Especialidades salvas com <b style="color:green">sucesso!</b></span>', 'success', 'green');
                setTimeout(function() {
                    window.location.reload();
                }, 2000);
            } else {
                sweetAlert('<span style="font-weight:normal">Erro!<br> Especialidades <b style="color:red">não salvas!</b></span>', 'error', 'red');
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
    }

    
    
});