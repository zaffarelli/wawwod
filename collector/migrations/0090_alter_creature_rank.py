# Generated by Django 5.0 on 2024-08-13 01:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0089_alter_creature_rank'),
    ]

    operations = [
        migrations.AlterField(
            model_name='creature',
            name='rank',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]