# Generated by Django 5.1.6 on 2025-03-12 11:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestion_usuarios', '0005_remove_physiotherapist_account_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appuser',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='/'),
        ),
    ]
