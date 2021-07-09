from django.db import models
from django.contrib import admin
from datetime import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
import json

import logging

logger = logging.Logger(__name__)

BREEDS = (
    ('0', 'Homid'),
    ('1', 'Metis'),
    ('2', 'Lupus')
)

AUSPICES = (
    ('0', 'Ragabash'),
    ('1', 'Theurge'),
    ('2', 'Philodox'),
    ('3', 'Galliard'),
    ('4', 'Ahroun')
)

TRIBES = (
    ('0', 'Black Furies'),
    ('1', 'Black Spiral Dancers'),
    ('2', 'Bone Gnawers'),
    ('3', 'Bunyips'),
    ('4', 'Children of Gaia'),
    ('5', 'Croatans'),
    ('6', 'Fiannas'),
    ('7', 'Glass Walkers'),
    ('8', 'Gets of Fenris'),
    ('9', 'Red Talons'),
    ('10', 'Silent Striders'),
    ('11', 'Silver Fangs'),
    ('12', 'Stargazers'),
    ('13', 'Uktenas'),
    ('14', 'Wendigos'),
    ('15', 'White Howlers'),
)


class Gift(models.Model):
    name = models.CharField(max_length=128, default='', primary_key=True)
    alternative_name = models.CharField(max_length=128, default='', blank=True)
    level = models.PositiveIntegerField(default=0)
    declaration = models.CharField(max_length=256, default='', blank=True)
    breed_0 = models.BooleanField(default=False, verbose_name='Homid')
    breed_1 = models.BooleanField(default=False, verbose_name='Metis')
    breed_2 = models.BooleanField(default=False, verbose_name='Lupus')
    breeds = models.CharField(default='...', max_length=3)
    auspices = models.CharField(default='.....', max_length=5)
    tribes = models.CharField(default='________________', max_length=16)
    auspice_0 = models.BooleanField(default=False, verbose_name='Ragabash')
    auspice_1 = models.BooleanField(default=False, verbose_name='Theurge')
    auspice_2 = models.BooleanField(default=False, verbose_name='Philodox')
    auspice_3 = models.BooleanField(default=False, verbose_name='Galliard')
    auspice_4 = models.BooleanField(default=False, verbose_name='Ahroun')

    tribe_0 = models.BooleanField(default=False, verbose_name='Black Furies')
    tribe_1 = models.BooleanField(default=False, verbose_name='Black Spiral Dancers')
    tribe_2 = models.BooleanField(default=False, verbose_name='Bone Gnawers')
    tribe_3 = models.BooleanField(default=False, verbose_name='Bunyips')
    tribe_4 = models.BooleanField(default=False, verbose_name='Children of Gaia')
    tribe_5 = models.BooleanField(default=False, verbose_name='Croatans')
    tribe_6 = models.BooleanField(default=False, verbose_name='Fiannas')
    tribe_7 = models.BooleanField(default=False, verbose_name='Glass Walkers')
    tribe_8 = models.BooleanField(default=False, verbose_name='Gets of Fenris')
    tribe_9 = models.BooleanField(default=False, verbose_name='Red Talons')
    tribe_10 = models.BooleanField(default=False, verbose_name='Silent Striders')
    tribe_11 = models.BooleanField(default=False, verbose_name='Silver Fangs')
    tribe_12 = models.BooleanField(default=False, verbose_name='Stargazers')
    tribe_13 = models.BooleanField(default=False, verbose_name='Uktenas')
    tribe_14 = models.BooleanField(default=False, verbose_name='Wendigos')
    tribe_15 = models.BooleanField(default=False, verbose_name='White Howlers')

    description = models.TextField(max_length=1024, blank=True, default='')

    def fix(self):
        self.declaration = f'{self.name.title()} ({self.level})'
        breeds = '___'
        auspices = '_____'
        tribes = '________________'
        for n in range(3):
            if getattr(self, f'breed_{n}') == True:
                breeds = breeds[0:n] + 'X' + breeds[n + 1:]
            else:
                breeds = breeds[0:n] + 'o' + breeds[n + 1:]
        for n in range(5):
            if getattr(self, f'auspice_{n}') == True:
                auspices = auspices[0:n] + 'X' + auspices[n + 1:]
            else:
                auspices = auspices[0:n] + 'o' + auspices[n + 1:]
        for n in range(16):
            if getattr(self, f'tribe_{n}') == True:
                tribes = tribes[0:n] + 'X' + tribes[n + 1:]
            else:
                tribes = tribes[0:n] + 'o' + tribes[n + 1:]
        self.breeds = breeds
        self.auspices = auspices
        self.tribes = tribes

    def __str__(self):
        return f'{self.name.title()} ({self.level})'


def refix(modeladmin, request, queryset):
    for gift in queryset:
        gift.fix()
        gift.save()
    short_description = 'Fix gift'


class GiftAdmin(admin.ModelAdmin):
    list_display = ['name', 'level', 'breeds', 'auspices', 'tribes', 'alternative_name', 'description']
    ordering = ['-breeds', '-auspices', '-tribes', 'level', 'name']
    list_filter = ['breed_0', 'breed_1', 'breed_2', 'auspice_0', 'auspice_1', 'auspice_2', 'auspice_3', 'auspice_4',
                   'tribe_0', 'tribe_1', 'tribe_2', 'tribe_3', 'tribe_4', 'tribe_5', 'tribe_6', 'tribe_7', 'tribe_8',
                   'tribe_9', 'tribe_10', 'tribe_11', 'tribe_12', 'tribe_13', 'tribe_14', 'tribe_15'
                   ]
    search_fields = ['name', 'description', 'alternative_name']
    actions = [refix]
