document.addEventListener('DOMContentLoaded', function() {

    const navbar = document.querySelector('#navbar')
    navbar.style.display = 'none';

    // const dataSelect = document.getElementById("id_data");
    // const horaSelect = document.getElementById("id_hora");
    // const horariosDisponiveis = document.querySelectorAll(".horario-disponivel");

    // // Função para habilitar/desabilitar o campo 'hora' conforme a seleção da data
    // function toggleHoraField() {
    //     if (dataSelect.value) {
    //         horaSelect.removeAttribute("disabled");
    //     } else {
    //         horaSelect.value = "";
    //         horaSelect.setAttribute("disabled", true);
    //     }
    // }

    // // Função para filtrar os horários disponíveis com base na data selecionada
    // function filterHorarios() {
    //     var dataSelecionada = dataSelect.value;
    //     horaSelect.innerHTML = "";
    //     horariosDisponiveis.forEach(function(horario) {
    //         if (horario.dataset.data === dataSelecionada) {
    //             horaSelect.innerHTML += "<option value='" + horario.textContent + "'>" + horario.textContent + "</option>";
    //         }
    //     });
    // }

    // // Adicionar listener para o evento 'change' do campo 'data'
    // dataSelect.addEventListener("change", function() {
    //     toggleHoraField();
    //     filterHorarios();
    // });

    // // Chame as funções para configurar inicialmente o estado do campo 'hora' e os horários disponíveis
    // toggleHoraField();
    // filterHorarios();


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
                sweetAlert('<span style="font-weight:normal">Erro! Agendamento de Retorno <b style="color:red">não realizado!</b></span>', 'error', 'red');
                throw new Error('Server response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.agendado === "sim") {

                // enviarWhatsapp()
                const idAgendamento = data.id_agendamento;


                window.location.href = `/produtor/confirmacao-atendimento/${idAgendamento}/`;
            } else {
                sweetAlert('<span style="font-weight:normal">Erro! Agendamento de Retorno <b style="color:red">não realizado!</b></span>', 'error', 'red');
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
    }
    
    function enviarWhatsapp(){
        const instanceId = '3CEEC225043C207F474772B70F2FFCF9';
        const token = 'A372402C7A0305ADB93E709A';
        const clientToken = 'Fe8f42da6eed445c3bfb0004dabaeb125S'; // Você precisa inserir o Client-Token correto aqui
    
        const phone = "556193250716"; // Garanta que este valor esteja correto
        const message = "Deu certo!"; // Garanta que este valor esteja correto
        
        const conteudo = JSON.stringify({
            "phone": phone,
            "message": message
        });
    
        // Imprime o JSON final enviado
        console.log("JSON enviado:", conteudo);
    
        const postURL = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`;
    
        fetch(postURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Client-Token': clientToken // Adiciona o Client-Token ao cabeçalho da requisição
            },
            body: conteudo,
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            console.log('Sucesso:', data);
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
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


    document.getElementById('id_atividade_produtiva').addEventListener('change', function() {
        const atividadeProdutivaText = this.options[this.selectedIndex].text;
        const topicoSelect = document.getElementById('id_topico');
        const topicosData = document.getElementById('topico-data').textContent;

        try {
            const topicosParsed = JSON.parse(topicosData);

            // Limpar as opções atuais
            topicoSelect.innerHTML = '';

            // Adicionar a opção vazia padrão
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = '';
            topicoSelect.appendChild(defaultOption);

            // Adicionar novas opções
            for (const [topico, atividades] of Object.entries(topicosParsed)) {
                if (atividades.includes(atividadeProdutivaText)) {
                    const option = document.createElement('option');
                    option.value = topico;
                    option.text = topico;
                    topicoSelect.appendChild(option);
                }
            }

        } catch (e) {
            console.error("Failed to parse JSON:", e);
        }
    });


    const atividadeProdutivaSelect = document.getElementById('id_atividade_produtiva');
    const dataSelect = document.getElementById('id_data');
    const horaSelect = document.getElementById('id_hora');

    atividadeProdutivaSelect.addEventListener('change', function() {
        const atividadeProdutiva = this.value;
        if (atividadeProdutiva) {
            fetch(`/produtor/datas-horarios/${atividadeProdutiva}/`)
                .then(response => response.json())
                .then(data => {
                    console.log('Data received:', data); // Log para verificar os dados recebidos
                    dataSelect.innerHTML = '<option value=""></option>';
                    data.datas.forEach(date => {
                        const option = document.createElement('option');
                        option.value = date;
                        option.textContent = date;
                        dataSelect.appendChild(option);
                    });

                    horaSelect.innerHTML = '<option value=""></option>';
                    horaSelect.setAttribute('disabled', true);

                    dataSelect.dataset.horarios = JSON.stringify(data.horarios);
                    console.log('Horários armazenados:', dataSelect.dataset.horarios); // Log para verificar os horários armazenados
                })
                .catch(error => console.error('Error fetching dates and times:', error));
        } else {
            dataSelect.innerHTML = '<option value=""></option>';
            horaSelect.innerHTML = '<option value=""></option>';
            horaSelect.setAttribute('disabled', true);
        }
    });

    // Função para filtrar horários disponíveis com base na data selecionada
    dataSelect.addEventListener('change', function() {
        const selectedDate = this.value;
        if (selectedDate && dataSelect.dataset.horarios) {
            horaSelect.innerHTML = '<option value=""></option>';
            horaSelect.removeAttribute('disabled');

            try {
                const horarios = JSON.parse(dataSelect.dataset.horarios);
                const horariosFiltrados = horarios.filter(horario => horario[0] === selectedDate);

                console.log('Horários filtrados:', horariosFiltrados); // Log para verificar os horários filtrados

                horariosFiltrados.forEach(horario => {
                    const option = document.createElement('option');
                    option.value = horario[1];
                    option.textContent = horario[1];
                    horaSelect.appendChild(option);
                });
            } catch (e) {
                console.error('Failed to parse horarios:', e);
            }
        } else {
            horaSelect.innerHTML = '<option value=""></option>';
            horaSelect.setAttribute('disabled', true);
        }
    });


});