# Generated by Django 4.2.1 on 2023-06-16 00:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0041_background'),
    ]

    operations = [
        migrations.AlterField(
            model_name='background',
            name='description',
            field=models.TextField(blank=True, default='', max_length=256),
        ),
    ]