# Generated by Django 3.2.1 on 2021-06-18 00:45

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('collector', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Place',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=128)),
                ('acronym', models.CharField(default='', max_length=24)),
                ('description', models.TextField(blank=True, default='', max_length=1024)),
                ('special_rules', models.TextField(blank=True, default='', max_length=1024)),
                ('importance', models.PositiveIntegerField(blank=True, default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Scene',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=128)),
                ('time_offset_hours', models.IntegerField(blank=True, default=-1)),
                ('time_offset_custom', models.CharField(blank=True, default='', max_length=32)),
                ('day', models.DateTimeField(blank=True, default=datetime.datetime.now, null=True)),
                ('place_order', models.PositiveIntegerField(blank=True, default=0)),
                ('preamble', models.TextField(blank=True, default='', max_length=1024)),
                ('description', models.TextField(blank=True, default='', max_length=1024)),
                ('rewards', models.TextField(blank=True, default='', max_length=1024)),
                ('consequences', models.TextField(blank=True, default='', max_length=1024)),
                ('cast', models.TextField(blank=True, default='', max_length=1024)),
                ('is_event', models.BooleanField(default=False)),
                ('is_downtime', models.BooleanField(default=False)),
                ('place', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='storytelling.place')),
            ],
        ),
        migrations.CreateModel(
            name='Story',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=128)),
                ('acronym', models.CharField(default='', max_length=16)),
                ('description', models.TextField(blank=True, default='', max_length=1024)),
                ('dday', models.DateTimeField(blank=True, default=datetime.datetime.now, null=True)),
                ('is_current', models.BooleanField(default=False)),
                ('chronicle', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='collector.chronicle')),
            ],
        ),
        migrations.CreateModel(
            name='ScenesLink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(choices=[('FOE', 'Enemies action consequences'), ('FRIEND', 'Allies action consequences'), ('THIRD', 'Third Party action consequences'), ('TIME', 'Time passing consequences'), ('FATE', 'Randomness, luck, fate consequences')], default='TIME', max_length=10)),
                ('description', models.TextField(blank=True, default='', max_length=1024)),
                ('valid', models.BooleanField(default=True)),
                ('order_in', models.IntegerField(blank=True, default=0)),
                ('order_out', models.IntegerField(blank=True, default=0)),
                ('scene_from', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='scenefrom', to='storytelling.scene')),
                ('scene_to', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sceneto', to='storytelling.scene')),
            ],
            options={
                'ordering': ['category', 'scene_from', 'scene_to'],
            },
        ),
        migrations.AddField(
            model_name='scene',
            name='story',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='storytelling.story'),
        ),
        migrations.AddField(
            model_name='place',
            name='story',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='storytelling.story'),
        ),
    ]
