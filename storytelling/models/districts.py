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

ALL_STATUS = (
    ('full', 'Full'),
    ('controlled', 'Controlled'),
    ('presence', 'Presence'),
    ('neutral', 'Neutral'),
    ('incursions', 'Incursions'),
    ('contested', 'Contested'),
    ('lost', 'Lost')
)


class District(models.Model):
    code = models.CharField(max_length=64, default='', unique=True)

    name = models.CharField(max_length=96, default='')
    district_name = models.CharField(max_length=96, default='', blank=True, null=True)
    sector_name = models.CharField(max_length=96, default='', blank=True, null=True)
    d_num = models.PositiveIntegerField(default=1)
    # s_num = models.PositiveIntegerField(default=1)
    description = models.TextField(max_length=1024, blank=True, default='')
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True)
    color = ColorField(default='#808080')
    proeminent = models.CharField(max_length=64, default='', blank=True, null=True)
    title = models.CharField(max_length=256, default='', blank=True, null=True)
    status = models.CharField(max_length=64, default='neutral', choices=ALL_STATUS, blank=True, null=True)
    population = models.PositiveIntegerField(default=0, blank=True, null=True)
    population_details = models.CharField(max_length=512, default='', blank=True, null=True)
    camarilla_resources = models.PositiveIntegerField(default=0, blank=True, null=True)
    camarilla_intelligence = models.PositiveIntegerField(default=0, blank=True, null=True)
    camarilla_power = models.PositiveIntegerField(default=0, blank=True, null=True)
    camarilla_leisure = models.PositiveIntegerField(default=0, blank=True, null=True)

    def __str__(self):
        return f'{self.name} [{self.code}]'

    def set_proeminent(self, value):
        self.proeminent = value
        self.color = CLAN_COLORS[value]

    def toJSON(self):
        jstr = json.dumps(self, default=json_default, sort_keys=True, indent=4)
        return jstr

    def fix(self):
        self.code = f'{self.city.code}{self.d_num:03}'
        self.populate()
        if (self.district_name != '') and (self.sector_name != ''):
            self.name = f'{self.district_name} :: {self.sector_name}'

    def populate(self):
        from collector.models.creatures import Creature
        from collector.utils.wod_reference import get_current_chronicle
        chronicle = get_current_chronicle()
        camarilla = Creature.objects.filter(chronicle=chronicle.acronym, faction__in=['Camarilla','Anarchs'], creature='kindred',
                                               hidden=False, district=self.code).order_by('-freebies')
        independents = Creature.objects.filter(chronicle=chronicle.acronym, faction='Independents', creature='kindred',
                                               hidden=False, district=self.code).order_by('-freebies')
        sabbat = Creature.objects.filter(chronicle=chronicle.acronym, faction='Sabbat', creature='kindred',
                                               hidden=False, district=self.code).order_by('-freebies')
        self.population_details = ''
        self.population = 0
        cama_pop = 0
        inde_pop = 0
        sabb_pop = 0
        for k in camarilla:
            self.population_details += f'<li><span class="camarilla">{k.name}</span> ({k.freebies})</li>'
            self.population += 1
            cama_pop += k.freebies
        for k in independents:
            self.population_details += f'<li><span class="independents">{k.name}</span> ({k.freebies})</li>'
            self.population += 1
            inde_pop += k.freebies
        for k in sabbat:
            self.population_details += f'<li><span class="sabbat">{k.name}</span> ({k.freebies})</li>'
            self.population += 1
            sabb_pop += k.freebies
        if inde_pop == 0 and sabb_pop == 0:
            if cama_pop > 90:
                self.status = 'full'
            elif cama_pop > 45:
                self.status = 'controlled'
            elif cama_pop > 10:
                self.status = 'presence'
            else:
                self.status = 'neutral'
        else:
            if sabb_pop > cama_pop:
                self.status = 'lost'
                if sabb_pop < inde_pop:
                    self.status = 'contested'
            elif inde_pop > cama_pop and inde_pop > sabb_pop:
                self.status = 'incursions'
            else:
                self.status = 'neutral'


# Actions

def status_camarilla_contested_giovanni(modeladmin, request, queryset):
    for district in queryset:
        district.status = 'camarilla-contested-giovanni'
        district.save()
    short_description = 'Status: Camarilla Contested Giovanni'


def status_neutral(modeladmin, request, queryset):
    for district in queryset:
        district.status = "neutral"
        district.save()
    short_description = 'Status: Neutral'


def status_gangrel_territory(modeladmin, request, queryset):
    for district in queryset:
        district.status = 'gangrel-territory'
        district.save()
    short_description = 'Status: Gangrel Territory'


def status_sparse_incursions(modeladmin, request, queryset):
    for district in queryset:
        district.status = "sparse-incursions"
        district.save()
    short_description = 'Status: Sparse Incursions'


def status_camarilla_presence(modeladmin, request, queryset):
    for district in queryset:
        district.status = 'camarilla-presence'
        district.save()
    short_description = 'Status: Camarilla Presence'


def status_camarilla_controlled(modeladmin, request, queryset):
    for district in queryset:
        district.status = 'camarilla-controlled'
        district.save()
    short_description = 'Status: Camarilla Controlled'


def status_camarilla(modeladmin, request, queryset):
    for district in queryset:
        district.status = 'camarilla'
        district.save()
    short_description = 'Status: Camarilla'


def repopulate(modeladmin, request, queryset):
    for district in queryset:
        district.save()
    short_description = 'Repopulate'


class DistrictAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'district_name', 'sector_name', 'status', 'proeminent', 'population', 'city']
    ordering = ['code']
    search_fields = ['name', 'description', 'proeminent']
    list_editable = ['status', 'sector_name', 'district_name']
    list_filter = ['city', 'd_num', 'proeminent', 'color']
    actions = [repopulate,
               status_neutral,
               status_camarilla,
               status_camarilla_controlled,
               status_camarilla_presence,
               status_gangrel_territory,
               status_camarilla_contested_giovanni,
               status_sparse_incursions
               ]
