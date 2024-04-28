import re
from comtele_sdk.textmessage_service import TextMessageService
api_key = '7c47eee4-d83e-4358-a555-978582f5be53'

def enviar_sms(id, mensagem, celular):
    textmessage_service = TextMessageService(api_key)
    celular_formatado = re.sub(r'\D', '', celular)
    result = textmessage_service.send(
        id,
        mensagem,
        [celular_formatado],
    )

    print(result)
