#Choices
YES_NO = [
    (True, 'Sim'),
    (False, 'Não'),
]

SIM_NAO = [
    ('sim', 'Sim'),
    ('nao', 'Não'),
]

COR_PELE = [
    ('branco', 'Branco'),
    ('preto', 'Preto'),
    ('pardo', 'Pardo'),
    ('amarelo', 'Amarelo'),
    ('vermelho', 'Vermelho'),
    ('outro', 'Outro'),
    ('nao_informado', 'Não Informado'),
]

GENERO_SEXUAL = [
    ('masculino', 'Masculino'),
    ('feminino', 'Feminino'),
    ('outro', 'Outro'),
    ('', ''),
]

TIPO_CONTA_BANCARIA = [
    ('corrente', 'Corrente'),
    ('poupanca', 'Poupança'),
]

ATIVIDADE_PRODUTIVA = [
    ('agricultura_anual', 'Agricultura Anual'),
    ('apicultura', 'Apicultura'),
    ('avicultura', 'Avicultura'),
    ('bovinocultura_leite', 'Bovino de Leite'),
    ('bovinocultura_corte', 'Bovino de Corte'),
    ('cafeicultura', 'Cafeicultura'),
    ('fruticultura', 'Fruticultura'),
    ('olericultura', 'Olericultura'),
    ('ovinocaprino_corte', 'Ovinocaprino de Corte'),
    ('ovinocaprino_leite', 'Ovinocaprino de Leite'),
    ('piscicultura', 'Piscicultura'),
]

LISTA_HORA_ATENDIMENTO = [
    ('08:00', '08:00'),
    ('09:00', '09:00'),
    ('10:00', '10:00'),
    ('11:00', '11:00'),
    ('14:00', '14:00'),
    ('15:00', '15:00'),
    ('16:00', '16:00'),
    ('17:00', '17:00'),
]

TOPICO_ATENDIMENTO = {
    'Abate': ['Avicultura', 'Bovino de Corte'],
    'Alimentação': ['Piscicultura'],
    'Alimentação das Abelhas': ['Apicultura'],
    'Bem-Estar Animal': ['Avicultura', 'Bovino de Leite', 'Bovino de Corte', 'Ovinocaprino de Corte', 'Ovinocaprino de Leite', 'Piscicultura'],
    'Biossegurança': ['Avicultura'],
    'Colheita': ['Agricultura Anual', 'Cafeicultura', 'Fruticultura', 'Olericultura'],
    'Controle de Doenças': ['Agricultura Anual', 'Cafeicultura', 'Fruticultura', 'Olericultura'],
    'Controle de Pragas': ['Agricultura Anual', 'Cafeicultura', 'Fruticultura', 'Olericultura'],
    'Ensilagem': ['Bovino de Leite', 'Ovinocaprino de Leite'],
    'Incubação de Ovos': ['Avicultura'],
    'Manejo das Abelhas': ['Apicultura'],
    'Manejo das Colmeias': ['Apicultura'],
    'Manejo de Ordenha': ['Bovino de Leite', 'Ovinocaprino de Leite'],
    'Manejo de Pastagens': ['Bovino de Corte', 'Bovino de Leite', 'Ovinocaprino de Corte', 'Ovinocaprino de Leite'],
    'Manejo de Pomar': ['Fruticultura Perene'],
    'Manejo de Tanques': ['Piscicultura'],
    'Manejo do Solo': ['Agricultura Anual', 'Cafeicultura', 'Fruticultura', 'Olericultura'],
    'Manejo Reprodutivo': ['Bovino de Corte', 'Bovino de Leite', 'Ovinocaprino de Corte', 'Ovinocaprino de Leite', 'Piscicultura'],
    'Melhoramento Genético': ['Agricultura Anual', 'Bovino de Corte', 'Bovino de Leite', 'Ovinocaprino de Corte', 'Ovinocaprino de Leite', 'Piscicultura'],
    'Nutrição Animal': ['Avicultura', 'Bovino de Corte', 'Bovino de Leite', 'Ovinocaprino de Corte', 'Ovinocaprino de Leite', 'Piscicultura'],
    'Nutrição e Adubação': ['Agricultura Anual', 'Cafeicultura', 'Fruticultura', 'Olericultura'],
    'Pós-Colheita': ['Cafeicultura', 'Fruticultura', 'Olericultura'],
    'Produção de Geleia Real': ['Apicultura'],
    'Produção de Mel': ['Apicultura'],
    'Produção de Ovos': ['Avicultura'],
    'Produção de Própolis': ['Apicultura'],
    'Processamento': ['Cafeicultura', 'Fruticultura', 'Olericultura'],
    'Qualidade da Água': ['Piscicultura'],
    'Sanidade Animal': ['Avicultura', 'Bovino de Corte', 'Bovino de Leite', 'Ovinocaprino de Corte', 'Ovinocaprino de Leite', 'Piscicultura'],
    'Saúde das Abelhas': ['Apicultura'],
    'Terminação': ['Bovino de Corte', 'Ovinocaprino de Corte'],
    'Outro assunto': ['Agricultura Anual', 'Apicultura', 'Avicultura', 'Bovino de Corte', 'Bovino de Leite', 'Cafeicultura', 'Fruticultura', 'Olericultura', 'Ovinocaprino de Corte', 'Ovinocaprino de Leite', 'Piscicultura']
}




STATUS_ATENDIMENTO = [
    ('agendado', 'Agendado'),
    ('cancelado', 'Cancelado'),
    ('atendido', 'Atendido'),
    ('finalizado', 'Finalizado'),
]

SUBSTATUS_ATENDIMENTO = [
    ('aguardando_atendimento', 'Aguardando atendimento'),
    ('cancelado_produtor', 'Cancelado pelo produtor'),
    ('cancelado_tecnico', 'Cancelado pelo técnico'),
    ('aguardando_relatorio', 'Aguardando o relatório'),
    ('aguardando_finalizar', 'Aguardando o técnico finalizar'),
    ('produtor_avaliar', 'Produtor ainda não avaliou'),
    ('produtor_avaliou', 'Produtor avaliou')
]

MOTIVO_CANCELAMENTO = [
    ('produtor_nao_compareceu', 'Produtor não compareceu'),
    ('tecnico_nao_podia_atender', 'Técnico não podia atender'),
    ('outro_motivo', 'Outro motivo'),
]

FORMA_ATENDIMENTO = [
    ('apenas_audio', 'Apenas áudio'),
    ('audio_video', 'Áudio e vídeo'),
]

CNPJ_PORTE = [
    ('mei', 'MEI'),
    ('me', 'ME'),
    ('epp', 'EPP'),
    ('medio_porte', 'Médio Porte'),
    ('grande_empresa', 'Grande Empresa'),
    ('demais', 'Demais'),
]

TIPO_DIREITO = {
    ('privado', 'Privado'),
    ('público', 'Público'),
}

LISTA_UFS_SIGLAS = [
    ('', ''),
    ('AC', 'AC'),
    ('AL', 'AL'),
    ('AM', 'AM'),
    ('AP', 'AP'),
    ('BA', 'BA'),
    ('CE', 'CE'),
    ('DF', 'DF'),
    ('ES', 'ES'),
    ('GO', 'GO'),
    ('MA', 'MA'),
    ('MG', 'MG'),
    ('MS', 'MS'),
    ('MT', 'MT'),
    ('PA', 'PA'),
    ('PB', 'PB'),
    ('PE', 'PE'),
    ('PI', 'PI'),
    ('PR', 'PR'),
    ('RJ', 'RJ'),
    ('RN', 'RN'),
    ('RO', 'RO'),
    ('RR', 'RR'),
    ('RS', 'RS'),
    ('SC', 'SC'),
    ('SE', 'SE'),
    ('SP', 'SP'),
    ('TO', 'TO'),
]


LISTA_DATAS = [
    ('04/03/2024', '04/03/2024'),
    ('05/03/2024', '05/03/2024'),
    ('06/03/2024', '06/03/2024'),
    ('07/03/2024', '07/03/2024'),
    ('08/03/2024', '08/03/2024'),
    ('09/03/2024', '09/03/2024'),
    ('10/03/2024', '10/03/2024'),
]
