# Generated by Django 4.2.1 on 2023-08-05 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0049_alter_creature_attribute0_alter_creature_attribute1_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='creature',
            name='virtue_name0',
            field=models.CharField(blank=True, default='', max_length=32),
        ),
        migrations.AddField(
            model_name='creature',
            name='virtue_name1',
            field=models.CharField(blank=True, default='', max_length=32),
        ),
        migrations.AddField(
            model_name='creature',
            name='virtue_name2',
            field=models.CharField(blank=True, default='', max_length=32),
        ),
    ]