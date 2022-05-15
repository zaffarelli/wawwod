from django.db import models
from django.contrib import admin
from storytelling.models.cities import City
from collector.utils.helper import json_default
import json
import logging
from colorfield.fields import ColorField

logger = logging.Logger(__name__)

CLAN_COLORS = {
    'none': '#B1CBC6',
    'assamites': '#2E36C5',
    'brujah': '#B3D537',
    'gangrel': '#738436',
    'giovanni': '#2F1984',
    'malkavian': '#847619',
    'nosferatu': '#843661',
    'lasombra': '#60D2BA',
    'ravnos': '#5F42D0',
    'setite': '#8C78D9',
    'toreador': '#D5B237',
    'tremere': '#D58337',
    'tzimisce': '#127B65',
    'ventrue': '#731919'
}


class District(models.Model):
    code = models.CharField(max_length=64, default='', unique=True)
    name = models.CharField(max_length=96, default='')
    sector_name = models.CharField(max_length=96, default='')
    d_num = models.PositiveIntegerField(default=1)
    s_num = models.PositiveIntegerField(default=1)
    description = models.TextField(max_length=1024, blank=True, default='')
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True)
    color = ColorField(default='#808080')
    proeminent = models.CharField(max_length=64, default='', blank=True, null=True)
    title = models.CharField(max_length=256, default='', blank=True, null=True)

    def __str__(self):
        return f'{self.name} [{self.code}]'

    def set_proeminent(self, value):
        self.proeminent = value
        self.color = CLAN_COLORS[value]

    def toJSON(self):
        jstr = json.dumps(self, default=json_default, sort_keys=True, indent=4)
        return jstr


# Actions


def not_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('none')
        creature.save()
    short_description = 'Not Controlled'


def assamites_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('assamites')
        creature.save()
    short_description = 'Assamites Controlled'


def brujah_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('brujah')
        creature.save()
    short_description = 'Brujah Controlled'


def giovanni_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('giovanni')
        creature.save()
    short_description = 'Giovanni Controlled'


def gangrel_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('gangrel')
        creature.save()
    short_description = 'Gangrel Controlled'

def lasombra_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('lasombra')
        creature.save()
    short_description = 'Lasombra Controlled'

def malkavian_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('malkavian')
        creature.save()
    short_description = 'Malkavian Controlled'


def nosferatu_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('nosferatu')
        creature.save()
    short_description = 'Nosferatu Controlled'


def ravnos_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('ravnos')
        creature.save()
    short_description = 'Ravnos Controlled'


def setite_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('setite')
        creature.save()
    short_description = 'Setite Controlled'


def toreador_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('toreador')
        creature.save()
    short_description = 'Toreador Controlled'


def tzimisce_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('tzimisce')
        creature.save()
    short_description = 'Tzimisce Controlled'


def tremere_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('tremere')
        creature.save()
    short_description = 'Tremere Controlled'


def ventrue_controlled(modeladmin, request, queryset):
    for creature in queryset:
        creature.set_proeminent('ventrue')
        creature.save()
    short_description = 'Ventrue Controlled'


class DistrictAdmin(admin.ModelAdmin):
    list_display = ['name', 'sector_name', 'proeminent', 'title', 'code', 'city', 'color', 'description']
    ordering = ['code']
    search_fields = ['name', 'description', 'proeminent']
    list_filter = ['city', 'd_num', 'proeminent', 'color']
    actions = [not_controlled,
               assamites_controlled,
               brujah_controlled,
               gangrel_controlled,
               giovanni_controlled,
               lasombra_controlled,
               malkavian_controlled,
               nosferatu_controlled,
               ravnos_controlled,
               setite_controlled,
               toreador_controlled,
               tremere_controlled,
               tzimisce_controlled,
               ventrue_controlled
               ]
