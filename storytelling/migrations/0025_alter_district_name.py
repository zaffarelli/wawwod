# Generated by Django 3.2.13 on 2022-05-05 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('storytelling', '0024_alter_district_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='district',
            name='name',
            field=models.CharField(default='', max_length=64),
        ),
    ]
