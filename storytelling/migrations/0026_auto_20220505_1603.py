# Generated by Django 3.2.13 on 2022-05-05 16:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('storytelling', '0025_alter_district_name'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='city',
            options={'verbose_name_plural': 'Cities'},
        ),
        migrations.AlterField(
            model_name='district',
            name='name',
            field=models.CharField(default='', max_length=96),
        ),
    ]