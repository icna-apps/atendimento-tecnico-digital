document.addEventListener('DOMContentLoaded', function() {

    const dataSelect = document.getElementById("id_data");
    const horaSelect = document.getElementById("id_hora");
    const horariosDisponiveis = document.querySelectorAll(".horario-disponivel");

    // Função para habilitar/desabilitar o campo 'hora' conforme a seleção da data
    function toggleHoraField() {
        if (dataSelect) {
            if (dataSelect.value) {
                horaSelect.removeAttribute("disabled");
            } else {
                horaSelect.value = "";
                horaSelect.setAttribute("disabled", true);
            }
        }
    }

    // Função para filtrar os horários disponíveis com base na data selecionada
    function filterHorarios() {
        if (dataSelect) {
            var dataSelecionada = dataSelect.value;
            horaSelect.innerHTML = "";
            horariosDisponiveis.forEach(function(horario) {
                if (horario.dataset.data === dataSelecionada) {
                    horaSelect.innerHTML += "<option value='" + horario.textContent + "'>" + horario.textContent + "</option>";
                }
            });
        }
    }

    // Adicionar listener para o evento 'change' do campo 'data'
    if (dataSelect) {
        dataSelect.addEventListener("change", function() {
            toggleHoraField();
            filterHorarios();
        });
    }

    // Chame as funções para configurar inicialmente o estado do campo 'hora' e os horários disponíveis
    toggleHoraField();
    filterHorarios();





    const btnAgendarRetorno = document.querySelector('#btnAgendarRetorno')
    if (btnAgendarRetorno) {
        btnAgendarRetorno.addEventListener('click', function(event){
            event.preventDefault();
            agendarRetorno();
        })
    }
    

    function agendarRetorno(){
        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificarCamposAtendimentoRetorno()
        if (preenchimento_incorreto === false) {
            return;
        }

        //Enviar para o backend
            //definir o caminho
            const idAtendimento = document.querySelector('#idAtendimentoTecnico').innerText
            postURL = `/tecnico/atendimentos/atendimento/agendar-retorno/${idAtendimento}/`
    
            //pegar os dados
            let formData = new FormData(document.getElementById('formAgendarRetorno'));
    
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
            if (data.retorno === "sim") {
                sweetAlert('<span style="font-weight:normal">Agendamento de Retorno <b style="color:green">realizado com sucesso!</b></span>', 'success', 'green');
            } else {
                sweetAlert('<span style="font-weight:normal">Erro! Agendamento de Retorno <b style="color:red">não realizado!</b></span>', 'error', 'red');
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
    }

    function verificarCamposAtendimentoRetorno() {
        const campos = [
            { id: 'id_atividade_produtiva', mensagem: 'Informe a <b>Atividade Produtiva</b>!' },
            { id: 'id_topico', mensagem: 'Informe o <b>Tópico do Atendimento</b>!' },
            { id: 'id_data', mensagem: 'Informe a <b>Data</b>!' },
            { id: 'id_hora', mensagem: 'Informe a <b>Hora</b>!' },
            { id: 'atendimentoRetornoJustificativa', mensagem: 'Informe a <b>Justificativa</b>!' },
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