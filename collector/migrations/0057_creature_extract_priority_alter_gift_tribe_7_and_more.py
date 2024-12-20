# Generated by Django 5.0 on 2024-06-23 00:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0056_rite_system'),
    ]

    operations = [
        migrations.AddField(
            model_name='creature',
            name='extract_priority',
            field=models.PositiveIntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='gift',
            name='tribe_7',
            field=models.BooleanField(default=False, verbose_name='Gets of Fenris'),
        ),
        migrations.AlterField(
            model_name='gift',
            name='tribe_8',
            field=models.BooleanField(default=False, verbose_name='Glass Walkers'),
        ),
    ]
