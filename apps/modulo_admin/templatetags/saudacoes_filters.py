from django import template
from datetime import datetime

register = template.Library()

@register.filter(name='saudacao')
def saudacao(value):
    hora_atual = datetime.now().hour
    if 0 <= hora_atual < 12:
        return "Bom dia"
    elif 12 <= hora_atual < 18:
        return "Boa tarde"
    else:
        return "Boa noite"
