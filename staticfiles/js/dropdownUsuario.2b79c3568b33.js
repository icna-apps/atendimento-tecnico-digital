document.addEventListener('DOMContentLoaded', function() {
    const iconeUsuario = document.querySelector("#iconeUsuario");
    const dropdownUsuario = document.querySelector(".dropdown__usuario");

    // Função para alternar a visibilidade do dropdown
    function toggleDropdown(event) {
        dropdownUsuario.classList.toggle('visible');
        event.stopPropagation(); // Impede que o evento de clique se propague
    }

    // Função para esconder o dropdown
    function hideDropdown(event) {
        if (!dropdownUsuario.contains(event.target) && !iconeUsuario.contains(event.target)) {
            dropdownUsuario.classList.remove('visible');
        }
    }

    // Adiciona o ouvinte de eventos no ícone para alternar o dropdown
    iconeUsuario.addEventListener('click', toggleDropdown);

    // Adiciona o ouvinte de eventos no documento para fechar o dropdown quando clicar fora
    document.addEventListener('click', hideDropdown);
});