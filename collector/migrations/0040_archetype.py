# Generated by Django 4.2.1 on 2023-06-15 22:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0039_chronicle_is_storyteller_only'),
    ]

    operations = [
        migrations.CreateModel(
            name='Archetype',
            fields=[
                ('name', models.CharField(default='', max_length=128, primary_key=True, serialize=False)),
                ('source', models.CharField(blank=True, default='VTM3', max_length=32)),
                ('description', models.TextField(blank=True, default='', max_length=1024)),
                ('system', models.TextField(blank=True, default='', max_length=1024)),
            ],
        ),
    ]
