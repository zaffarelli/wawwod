# Generated by Django 2.2.4 on 2023-05-29 23:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0029_discipline'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='discipline',
            name='alternative_name',
        ),
        migrations.RemoveField(
            model_name='discipline',
            name='declaration',
        ),
    ]