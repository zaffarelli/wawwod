# Generated by Django 5.0 on 2024-11-11 04:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0099_creature_notes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='creature',
            name='notes',
            field=models.TextField(blank=True, default='', max_length=1024),
        ),
    ]
