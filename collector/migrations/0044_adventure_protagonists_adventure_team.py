# Generated by Django 4.2.1 on 2023-07-06 23:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0043_background_cumulate'),
    ]

    operations = [
        migrations.AddField(
            model_name='adventure',
            name='protagonists',
            field=models.CharField(blank=True, default='', max_length=1024),
        ),
        migrations.AddField(
            model_name='adventure',
            name='team',
            field=models.CharField(blank=True, default='', max_length=1024),
        ),
    ]
