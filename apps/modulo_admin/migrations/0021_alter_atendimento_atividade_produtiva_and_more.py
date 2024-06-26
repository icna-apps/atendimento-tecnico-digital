# Generated by Django 5.0.3 on 2024-06-20 13:24

import django.db.models.fields.related
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('modulo_admin', '0020_usuariocnpj'),
    ]

    operations = [
        migrations.AlterField(
            model_name='atendimento',
            name='atividade_produtiva',
            field=models.CharField(choices=[('agricultura_anual', 'Agricultura Anual'), ('apicultura', 'Apicultura'), ('avicultura', 'Avicultura'), ('bovinocultura_leite', 'Bovino de Leite'), ('bovinocultura_corte', 'Bovino de Corte'), ('cafeicultura', 'Cafeicultura'), ('fruticultura', 'Fruticultura'), ('olericultura', 'Olericultura'), ('ovinocaprino_corte', 'Ovinocaprino de Corte'), ('ovinocaprino_leite', 'Ovinocaprino de Leite'), ('piscicultura', 'Piscicultura')], max_length=120),
        ),
        migrations.AlterField(
            model_name='usuariocnpj',
            name='banco_codigo',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.fields.related.OneToOneField, related_name='banco_cnpj', to='modulo_admin.instituicoesfinanceiras'),
        ),
        migrations.AlterField(
            model_name='usuariocnpj',
            name='usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.fields.related.OneToOneField, related_name='usuario_cnpj', to='modulo_admin.usuario'),
        ),
    ]
