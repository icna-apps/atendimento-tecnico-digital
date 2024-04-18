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
    btnConfirmar.addEventListener('click', function(){
        window.location.href='/produtor/confirmacao-atendimento/'
    })

});