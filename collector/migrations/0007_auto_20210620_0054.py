# Generated by Django 3.2.1 on 2021-06-20 00:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0006_rename_total_gifts_creature_total_traits'),
    ]

    operations = [
        migrations.AddField(
            model_name='creature',
            name='total_fetters',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='creature',
            name='total_passions',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='creature',
            name='total_realms',
            field=models.IntegerField(default=0),
        ),
    ]
