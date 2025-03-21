# Generated by Django 4.2.1 on 2023-06-04 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('storytelling', '0045_alter_city_id_alter_district_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='HotSpot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=256)),
                ('description', models.TextField(blank=True, default='', max_length=1024)),
                ('gps_coords', models.CharField(blank=True, default='0,0', max_length=128)),
            ],
        ),
    ]
