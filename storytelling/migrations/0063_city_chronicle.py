# Generated by Django 5.0 on 2024-06-29 12:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0061_sept_rid_alter_sept_protagonists'),
        ('storytelling', '0062_alter_district_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='city',
            name='chronicle',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='collector.chronicle'),
        ),
    ]
