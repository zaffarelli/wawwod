# Generated by Django 4.2.1 on 2023-07-01 11:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('storytelling', '0059_hotspot_episode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hotspot',
            name='episode',
            field=models.CharField(blank=True, default='', max_length=128),
        ),
    ]
