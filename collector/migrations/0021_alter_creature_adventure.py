# Generated by Django 3.2.13 on 2022-05-17 00:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0020_creature_district'),
    ]

    operations = [
        migrations.AlterField(
            model_name='creature',
            name='adventure',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='collector.adventure'),
        ),
    ]
