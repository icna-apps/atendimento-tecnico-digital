import re
import os
from comtele_sdk.textmessage_service import TextMessageService
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv('COMTELE_API_KEY')

def enviar_sms(id, mensagem, celular):
    textmessage_service = TextMessageService(api_key)
    celular_formatado = re.sub(r'\D', '', celular)
    result = textmessage_service.send(
        id,
        mensagem,
        [celular_formatado],
    )

    print(result)


def enviar_whatsapp(message, celular):
    instance_id = '3CF11B7EEFDFE015E75472B70F2FFCF9'
    token = 'CD73083318F17C8E4D39F59F'
    client_token = 'F85328dd9cc194ffda6d749d97c9f62eaS'  # Insira o Client-Token correto aqui

    # phone = "556193250716"  # Garanta que este valor esteja correto
    phone = "55" + celular
    # message = "Deu certo!"  # Garanta que este valor esteja correto

    conteudo = json.dumps({
        "phone": phone,
        "message": message
    })

    post_url = f'https://api.z-api.io/instances/{instance_id}/token/{token}/send-text'

    headers = {
        'Content-Type': 'application/json',
        'Client-Token': client_token
    }

    response = requests.post(post_url, headers=headers, data=conteudo)

    try:
        response.raise_for_status()
        data = response.json()
        print('Sucesso:', data)
    except requests.exceptions.HTTPError as err:
        print('Erro na requisição:', err)
        print('Resposta:', response.text)