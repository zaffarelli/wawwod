# Generated by Django 3.2.1 on 2021-08-06 11:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('storytelling', '0011_scene_timeline'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='scene',
            options={'ordering': ['timeline', 'time_offset_hours']},
        ),
    ]
