# Generated by Django 5.0 on 2024-08-13 01:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0090_alter_creature_rank'),
    ]

    operations = [
        migrations.AddField(
            model_name='creature',
            name='garou_rank',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='creature',
            name='rank',
            field=models.CharField(blank=True, default='', max_length=64, null=True),
        ),
    ]
