# Generated by Django 2.2.4 on 2023-05-30 02:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0035_discipline_page'),
    ]

    operations = [
        migrations.AddField(
            model_name='discipline',
            name='is_linear',
            field=models.BooleanField(default=False),
        ),
    ]