# Generated by Django 5.0.3 on 2024-06-27 19:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('modulo_admin', '0023_alter_atendimento_imagem01_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='atendimento',
            name='del_status2',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='atendimentocancelado',
            name='imagem',
            field=models.BinaryField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='atendimentoconfirmacao',
            name='imagem',
            field=models.BinaryField(blank=True, null=True),
        ),
    ]
