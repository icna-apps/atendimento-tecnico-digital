# Generated by Django 5.0.3 on 2024-04-25 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('modulo_admin', '0011_atendimento_relatorio_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='atendimento',
            name='relatorio_atualizacao',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
