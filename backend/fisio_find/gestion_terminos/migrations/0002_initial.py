# Generated by Django 5.1.6 on 2025-03-13 16:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('gestion_terminos', '0001_initial'),
        ('gestion_usuarios', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='appterminos',
            name='modifier',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='gestion_usuarios.admin'),
        ),
    ]
