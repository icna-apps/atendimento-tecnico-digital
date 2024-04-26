function sweetAlert(title, icon, iconColor='black', position='center', timer=2500) {
    Swal.fire({
        position: position,
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: timer,
        iconColor: iconColor,
        backdrop: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: 'green',
    });
}

function sweetAlertPreenchimento({mensagem, title = 'Atenção!', icon = 'warning', iconColor = 'red'}) {
    Swal.fire({
        title: title,
        html: mensagem,
        icon: icon,
        iconColor: iconColor,
        confirmButtonText: 'Ok',
        confirmButtonColor: 'green',
    });
}


function sweetAlertConfirmacao(tittle, mensagem, textoConfirmacao, textoCancelar, url, csrfToken, url_apos) {
    Swal.fire({
    title: tittle,
    text: mensagem,
    icon: "warning",
    iconColor: 'red',
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#1AA33C",
    confirmButtonText: textoConfirmacao,
    cancelButtonText: textoCancelar,
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: url,
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function(response) {
                    Swal.fire({
                        title: "Cancelado!",
                        text: "Agendamento cancelado com sucesso!",
                        icon: "success",
                        confirmButtonColor: 'green',
                    });
                    setTimeout(function() {
                        window.location.href = url_apos;
                    }, 1500);
                },
                error: function(error) {
                    alert('Ocorreu um erro ao tentar cancelar. Por favor, tente novamente.');
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

