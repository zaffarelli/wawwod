from django.db import models
from django.contrib import admin

import logging

logger = logging.Logger(__name__)


class Discipline(models.Model):
    code = models.CharField(max_length=128, default='?', primary_key=True)
    name = models.CharField(max_length=128, default='')
    alternative_name = models.CharField(max_length=128, default='', blank=True)
    page = models.CharField(max_length=20, default='VtM3:pp', blank=True)
    level = models.PositiveIntegerField(default=1, blank=True)
    # declaration = models.CharField(max_length=256, default='', blank=True)

    clan_0 = models.BooleanField(default=False, verbose_name='Brujah')
    clan_1 = models.BooleanField(default=False, verbose_name='Gangrel')
    clan_2 = models.BooleanField(default=False, verbose_name='Malkavian')
    clan_3 = models.BooleanField(default=False, verbose_name='Nosferatu')
    clan_4 = models.BooleanField(default=False, verbose_name='Toreador')
    clan_5 = models.BooleanField(default=False, verbose_name='Tremere')
    clan_6 = models.BooleanField(default=False, verbose_name='Ventrue')
    clan_7 = models.BooleanField(default=False, verbose_name='Lasombra')
    clan_8 = models.BooleanField(default=False, verbose_name='Tzimisce')
    clan_9 = models.BooleanField(default=False, verbose_name='Assamites')
    clan_10 = models.BooleanField(default=False, verbose_name='Giovanni')
    clan_11 = models.BooleanField(default=False, verbose_name='Ravnos')
    clan_12 = models.BooleanField(default=False, verbose_name='Setite')

    has_rituals = models.BooleanField(default=False)
    is_linear = models.BooleanField(default=False)

    description = models.TextField(max_length=4096, blank=True, default='')
    technical_notes = models.TextField(max_length=4096, blank=True, default='')

    def fix(self):
        self.code = f'{self.name.title()} ({self.level})'
        self.alternative_name = self.alternative_name.title()

    def __str__(self):
        return f'{self.code})'




class DisciplineAdmin(admin.ModelAdmin):
    list_display = ['code', 'alternative_name', 'page', 'is_linear', 'technical_notes', ]
    ordering = ['code']
    list_filter = ['name', 'level', 'clan_0', 'clan_1', 'clan_2', 'clan_3', 'clan_4', 'clan_5', 'clan_6']
    search_fields = ['name', 'description']
    list_editable = ['technical_notes', 'page', 'is_linear']
    from collector.utils.helper import refix
    actions = [refix]
