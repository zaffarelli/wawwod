# Generated by Django 3.2.1 on 2021-06-19 14:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0005_auto_20210619_1428'),
    ]

    operations = [
        migrations.RenameField(
            model_name='creature',
            old_name='total_gifts',
            new_name='total_traits',
        ),
    ]
