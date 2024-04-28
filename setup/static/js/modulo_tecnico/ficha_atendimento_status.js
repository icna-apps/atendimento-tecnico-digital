document.addEventListener('DOMContentLoaded', function() {
    
    // Status do atendimento
    const elementoStatus = document.getElementById('statusAtendimento');
    const status = elementoStatus.getAttribute('data-status');
    
    // Funcionalidades
    const offcanvasCancelar = document.querySelector('#abrirOffcanvasCancelarAtendimento')
    const offcanvasConfirmar = document.querySelector('#abrirOffcanvasConfirmarAtendimento')
    const offcanvasFinalizar = document.querySelector('#abrirOffcanvasFinalizarAtendimento')
    const offcanvasAgendarRetorno = document.querySelector('#abrirOffcanvasAgendarRetorno')
    
    // Função principal
    function avaliarStatusAtendimento() {

        if (status == 'agendado'){
            funcionalidadeCancelamento(true)
            funcionalidadeConfirmar(true)
            funcionalidadeFinalizar(true)
            funcionalidadeAgendarRetorno(true)
        } else if (status == 'cancelado') {
            funcionalidadeCancelamento(true)
            funcionalidadeConfirmar(false)
            funcionalidadeFinalizar(false)
            funcionalidadeAgendarRetorno(false)
        } else {
            funcionalidadeCancelamento(false)
            funcionalidadeConfirmar(true)
            funcionalidadeFinalizar(true)
            funcionalidadeAgendarRetorno(true)
        }
        
        
    }
    
    // Cancelamento
    function funcionalidadeCancelamento(bool){
        if (bool) {
            offcanvasCancelar.classList.remove('funcionalidade_inativa');
            offcanvasCancelar.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }, false);
        } else {
            offcanvasCancelar.classList.add('funcionalidade_inativa');
            offcanvasCancelar.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }, true);
        }
    }

    // Confirmar
    function funcionalidadeConfirmar(bool){
        if (bool) {
            offcanvasConfirmar.classList.remove('funcionalidade_inativa');
            offcanvasConfirmar.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }, false);
        } else {
            offcanvasConfirmar.classList.add('funcionalidade_inativa');
            offcanvasConfirmar.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }, true);
        }
    }

    // Finalizar
    function funcionalidadeFinalizar(bool){
        if (bool) {
            offcanvasFinalizar.classList.remove('funcionalidade_inativa');
            offcanvasFinalizar.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }, false);
        } else {
            offcanvasFinalizar.classList.add('funcionalidade_inativa');
            offcanvasFinalizar.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }, true);
        }
    }
    
    // Agendar Retorno
    function funcionalidadeAgendarRetorno(bool){
        if (bool) {
            offcanvasAgendarRetorno.classList.remove('funcionalidade_inativa');
            offcanvasAgendarRetorno.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }, false);
        } else {
            offcanvasAgendarRetorno.classList.add('funcionalidade_inativa');
            offcanvasAgendarRetorno.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }, true);
        }
    }

    avaliarStatusAtendimento()
    

});