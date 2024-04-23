document.addEventListener('DOMContentLoaded', function() {

    $('#formCelular').mask('(00) 00000-0000');
    $('#formDataNascimento').mask('00/00/0000');


    formDataNascimento.addEventListener('change', function() {
        // A propriedade correta para obter o valor de um campo de input é `value`, não `ariaValue`
        let dataInserida = formDataNascimento.value;
    
        // Verificar se a data é válida. A função `Date.parse()` retorna NaN se a data for inválida
        let dataConvertida = Date.parse(dataInserida);
    
        // NaN é "falsy", então !dataConvertida será verdadeiro se dataConvertida for NaN
        if (!dataConvertida) {
            // Usando sweetAlert para mostrar uma mensagem de erro
            sweetAlert(
                tittle='Data de nascimento inválida!',
                icon='warning',
                iconColor='red',
            )
            // Resetar o valor do campo de data para vazio
            formDataNascimento.value = '';
        }
    });


});

