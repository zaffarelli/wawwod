# Generated by Django 3.2.13 on 2022-05-27 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0021_alter_creature_adventure'),
    ]

    operations = [
        migrations.AddField(
            model_name='creature',
            name='equipment',
            field=models.TextField(blank=True, default='', max_length=2048),
        ),
    ]