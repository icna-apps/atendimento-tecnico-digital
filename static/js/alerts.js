function sweetAlert(title, icon, iconColor='black', position='center', timer=2500) {
    Swal.fire({
        position: position,
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: timer,
        iconColor: iconColor,
        backdrop: false,
    });
}

function sweetAlertPreenchimento({html, title = 'Atenção!', icon = 'warning', iconColor = 'red'}) {
    Swal.fire({
        title: title,
        html: html,
        icon: icon,
        iconColor: iconColor,
        confirmButtonText: 'Ok',
        confirmButtonColor: 'green',
    });
}


function sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete) {
    Swal.fire({
    title: "Você tem certeza?",
    text: mensagem,
    icon: "warning",
    iconColor: 'red',
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, deletar!"
    }).then((result) => {
    if (result.isConfirmed) {
        $.ajax({
        url: url_delete,
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        success: function(response) {
            Swal.fire({
                title: "Deletado!",
                text: "Registro deletado com sucesso!",
                icon: "success",
                confirmButtonColor: 'green',
            });
            setTimeout(function() {
                window.location.href = url_apos_delete;
            }, 1500);
        },
        error: function(error) {
            alert('Ocorreu um erro ao tentar deletar. Por favor, tente novamente.');
        }
    });


        
    }
    });
}

function sweetAlertGenerico(title='Atenção!', html, icon='warning', iconColor='red', confirmButtonText='Ok', confirmButtonColor='green', onConfirm){
    Swal.fire({
        title: title,
        html: html,
        icon: icon,
        iconColor: iconColor,
        confirmButtonText: confirmButtonText,
        confirmButtonColor: confirmButtonColor,
    }).then((result) => {
        if (result.isConfirmed && onConfirm) {
            onConfirm();
        }
    });
}

