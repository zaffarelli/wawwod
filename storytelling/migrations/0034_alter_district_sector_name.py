# Generated by Django 3.2.13 on 2022-05-15 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('storytelling', '0033_district_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='district',
            name='sector_name',
            field=models.CharField(blank=True, default='', max_length=96, null=True),
        ),
    ]
