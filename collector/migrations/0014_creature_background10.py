# Generated by Django 3.2.1 on 2021-09-02 13:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0013_auto_20210627_0116'),
    ]

    operations = [
        migrations.AddField(
            model_name='creature',
            name='background10',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
