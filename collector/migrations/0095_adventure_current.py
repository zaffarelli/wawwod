# Generated by Django 5.0 on 2024-09-25 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0094_remove_creature_background12'),
    ]

    operations = [
        migrations.AddField(
            model_name='adventure',
            name='current',
            field=models.BooleanField(blank=True, default=False),
        ),
    ]