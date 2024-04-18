from datetime import datetime, timedelta


def get_next_week_days():
    today = datetime.today()

    # Criando um dicionário para armazenar o nome do dia da semana (curto, em português) e a data correspondente formatada
    semana_posterior = {}

    # Loop para os próximos 7 dias
    for i in range(1, 8):
        next_day = today + timedelta(days=i)
        # Formatando a data como 'dd/mm/yyyy'
        formatted_date = next_day.strftime('%d/%m/%Y')
        # Obtendo o nome do dia da semana em português (curto)
        weekday_short_pt = next_day.strftime('%A')[:3]  # Apenas os primeiros 3 caracteres do dia da semana em inglês

        # Traduzindo dias da semana do inglês para o português (curto)
        translate_days_short = {
            'Mon': 'Segunda',
            'Tue': 'Terça',
            'Wed': 'Quarta',
            'Thu': 'Quinta',
            'Fri': 'Sexta',
            'Sat': 'Sábado',
            'Sun': 'Domingo'
        }

        # Atualizando os nomes dos dias para português (curto)
        weekday_short_pt = translate_days_short[weekday_short_pt]

        # Invertendo a chave e o valor
        semana_posterior[weekday_short_pt] = formatted_date

    return semana_posterior



