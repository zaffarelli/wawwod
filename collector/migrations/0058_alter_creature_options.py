# Generated by Django 5.0 on 2024-06-23 00:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0057_creature_extract_priority_alter_gift_tribe_7_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='creature',
            options={'ordering': ['-extract_priority', 'name'], 'verbose_name': 'Creature'},
        ),
    ]