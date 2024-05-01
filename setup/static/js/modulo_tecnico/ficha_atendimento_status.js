document.addEventListener('DOMContentLoaded', function() {
    
    // Status do atendimento
    const elementoStatus = document.getElementById('statusAtendimento');
    const status = elementoStatus.getAttribute('data-status');
    
    // Funcionalidades
    const offcanvasCancelar = document.querySelector('#abrirOffcanvasCancelarAtendimento')
    const offcanvasAtender = document.querySelector('#offcanvasWhatsapp')
    const offcanvasConfirmar = document.querySelector('#abrirOffcanvasConfirmarAtendimento')
    const offcanvasFinalizar = document.querySelector('#abrirOffcanvasFinalizarAtendimento')
    const offcanvasAgendarRetorno = document.querySelector('#abrirOffcanvasAgendarRetorno')
    
    // Função principal
    function avaliarStatusAtendimento() {

        if (status == 'agendado'){
            funcionalidadeCancelamento(true)
            funcionalidadeAtender(true)
            funcionalidadeConfirmar(true)
            funcionalidadeAgendarRetorno(false)
            funcionalidadeFinalizar(false)
        } else if (status == 'cancelado') {
            funcionalidadeCancelamento(true)
            funcionalidadeAtender(true)
            funcionalidadeConfirmar(false)
            funcionalidadeAgendarRetorno(false)
            funcionalidadeFinalizar(false)
        } else if (status == 'atendido') {
            funcionalidadeCancelamento(false)
            funcionalidadeAtender(true)
            funcionalidadeConfirmar(true)
            funcionalidadeAgendarRetorno(true)
            funcionalidadeFinalizar(true)
        }  else if (status == 'finalizado') {
            funcionalidadeCancelamento(false)
            funcionalidadeAtender(true)
            funcionalidadeConfirmar(true)
            funcionalidadeAgendarRetorno(true)
            funcionalidadeFinalizar(true)
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

    // Atender
    function funcionalidadeAtender(bool){
        if (bool) {
            offcanvasAtender.classList.remove('funcionalidade_inativa');
            offcanvasAtender.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }, false);
        } else {
            offcanvasAtender.classList.add('funcionalidade_inativa');
            offcanvasAtender.addEventListener('click', function(event) {
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
    
    avaliarStatusAtendimento()
    
});