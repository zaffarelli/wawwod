# Generated by Django 5.0 on 2024-07-14 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0069_creature_edges'),
    ]

    operations = [
        migrations.CreateModel(
            name='Season',
            fields=[
                ('name', models.CharField(max_length=128, primary_key=True, serialize=False)),
                ('chronicle', models.CharField(default='WOD', max_length=8)),
                ('protagonists', models.CharField(blank=True, default='', max_length=1024)),
                ('team', models.CharField(blank=True, default='', max_length=1024)),
                ('code', models.CharField(blank=True, default='', max_length=32)),
                ('notes', models.TextField(blank=True, default='', max_length=1024)),
                ('players_starting_freebies', models.IntegerField(blank=True, default=15)),
            ],
        ),
    ]