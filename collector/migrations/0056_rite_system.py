# Generated by Django 5.0 on 2024-06-22 16:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0055_rename_declaration_rite_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='rite',
            name='system',
            field=models.TextField(blank=True, default='', max_length=1024),
        ),
    ]