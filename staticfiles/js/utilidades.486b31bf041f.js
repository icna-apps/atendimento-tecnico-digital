function cpfFormato(cpf) {

    let cpf_valor = cpf.replace(/\D/g, ''); // Remove tudo que não for dígito

    //Restringir tamanho do CPF
    if (cpf_valor.length > 11) {
        cpf_valor = cpf_valor.substring(0, 11); 
    }

    // Formatação ###.###.###-##
    if (cpf_valor.length > 9) {
        cpf_valor = cpf_valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    } else if (cpf_valor.length > 6) {
        cpf_valor = cpf_valor.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (cpf_valor.length > 3) {
        cpf_valor = cpf_valor.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    }

    return cpf_valor

}

function validaCPF(cpf) {

    cpf = cpf.replace(/\D/g, ''); // Remove todos os não dígitos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // CPF com todos os dígitos iguais é inválido
    }

    if (cpf.length === 11) {
        var sum = 0;
        var rest;
        for (var i = 1; i <= 9; i++) {
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) {
            rest = 0;
        }
        if (rest !== parseInt(cpf.substring(9, 10))) {
            return false;
        }

        sum = 0;
        for (var i = 1; i <= 10; i++) {
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) {
            rest = 0;
        }
        if (rest !== parseInt(cpf.substring(10, 11))) {
            return false;
        }

        return true; // CPF válido
    }

    return false; // CPF com menos de 11 dígitos não é válido
}

function validaCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;
}

function celularFormato(numero) {
    // Remove tudo que não for dígito
    let numeroLimpo = numero.replace(/\D/g, '');

    // Limita a 11 dígitos (2 para o DDD e 9 para o número)
    numeroLimpo = numeroLimpo.substring(0, 11);

    // Formata no padrão (##) #####-####
    // Primeiro verifica se o número tem o comprimento total
    if (numeroLimpo.length === 11) {
        return numeroLimpo.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else {
        // Se o número é mais curto, formata conforme o comprimento
        if (numeroLimpo.length > 7) {
            return numeroLimpo.replace(/^(\d{2})(\d{0,5})(\d{0,4})$/, '($1) $2-$3');
        } else if (numeroLimpo.length > 2) {
            return numeroLimpo.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
        } else {
            return numeroLimpo.replace(/^(\d*)$/, '($1');
        }
    }
}

async function procurarCNABR(cpf, mensagem) {
    const url = `/procurar_cnabr/${cpf}/${mensagem}/`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.usuario; // Retorna true ou false baseado na resposta do servidor
    } catch (error) {
        console.error('Erro ao procurar CNA.BR:', error);
        return false; // Considerando false como padrão em caso de erro
    }
}

async function validarSenhaCNABR(cpf, senha) {
    const url = `/procurar_cnabr/${cpf}/${mensagem}/`;
}

function buscarMunicipios(uf, componente) {
    const url = `/municipios-uf-json/${uf}/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var municipios = data.municipios;
            var options = '<option value=""></option>';
            for (var i = 0; i < municipios.length; i++) {
                options += '<option value="' + municipios[i].cod_ibge + '">' + municipios[i].municipio + '</option>';
            }
            $(componente).html(options);

        })
        .catch(error => console.error('Erro ao buscar dados do município:', error));
}

async function consultarCNPJ(cnpj) {
    const url = `/consultarcnpj/${cnpj}/`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if(data.retorno){
            return data.razao_social
        }
    } catch (error) {
        console.error('Erro ao procurar CNA.BR:', error);
        return false; // Considerando false como padrão em caso de erro
    }
}


function getCSRFToken() {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    console.log("CSRF Token:", token);  // Verifique se isso imprime o token correto no console
    return token;
  }

  function limparParagrafosVazios(html) {
    // Remove variações de parágrafos vazios como <p></p> ou <p><br></p>
    return html.replace(/<p>(<br\s*\/?>)?<\/p>/gi, '');
}