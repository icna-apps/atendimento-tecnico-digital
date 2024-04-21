document.addEventListener('DOMContentLoaded', function() {

    const navbar = document.querySelector('#navbar')
    navbar.style.display = 'none';

    const dataSelect = document.getElementById("id_data");
    const horaSelect = document.getElementById("id_hora");
    const horariosDisponiveis = document.querySelectorAll(".horario-disponivel");

    // Função para habilitar/desabilitar o campo 'hora' conforme a seleção da data
    function toggleHoraField() {
        if (dataSelect.value) {
            horaSelect.removeAttribute("disabled");
        } else {
            horaSelect.value = "";
            horaSelect.setAttribute("disabled", true);
        }
    }

    // Função para filtrar os horários disponíveis com base na data selecionada
    function filterHorarios() {
        var dataSelecionada = dataSelect.value;
        horaSelect.innerHTML = "";
        horariosDisponiveis.forEach(function(horario) {
            if (horario.dataset.data === dataSelecionada) {
                horaSelect.innerHTML += "<option value='" + horario.textContent + "'>" + horario.textContent + "</option>";
            }
        });
    }

    // Adicionar listener para o evento 'change' do campo 'data'
    dataSelect.addEventListener("change", function() {
        toggleHoraField();
        filterHorarios();
    });

    // Chame as funções para configurar inicialmente o estado do campo 'hora' e os horários disponíveis
    toggleHoraField();
    filterHorarios();


    const btnCancelar = document.querySelector('#btnCancelar')
    btnCancelar.addEventListener('click', function(){
        window.location.href='/produtor/meus-atendimentos/'
    })

    const btnConfirmar = document.querySelector('#btnConfirmar')
    btnConfirmar.addEventListener('click', function(event){
        event.preventDefault();
        realizarNovoAgendamento();
    })

    function realizarNovoAgendamento(){
        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificarCamposAtendimento()
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
                alert('Deu certo! ID do Agendamento: ' + idAgendamento);
                window.location.href = `/produtor/confirmacao-atendimento/${idAgendamento}/`;
            } else {
                sweetAlert('<span style="font-weight:normal">Erro! Agendamento <b style="color:red">não realizado!</b></span>', 'error', 'red');
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
    }

    function verificarCamposAtendimento() {
        const campos = [
            { id: 'id_atividade_produtiva', mensagem: 'Informe a <b>Atividade Produtiva</b>!' },
            { id: 'id_topico', mensagem: 'Informe o <b>Tópico do Atendimento</b>!' },
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