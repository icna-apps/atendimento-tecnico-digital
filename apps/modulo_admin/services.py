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
