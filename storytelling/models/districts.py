from django.db import models
from django.contrib import admin
from storytelling.models.cities import City
from collector.utils.helper import json_default
import json
import logging
from colorfield.fields import ColorField
from collector.utils.wod_reference import CLAN_COLORS

logger = logging.Logger(__name__)


class District(models.Model):
    class Situation(models.TextChoices):
        FULL = 'full', 'Full'
        CONTROLLED = 'controlled', 'Controlled'
        PRESENCE = 'presence', 'Presence'
        NEUTRAL = 'neutral', 'Neutral'
        INCURSIONS = 'incursions', 'Incursions'
        CONTESTED = 'contested', 'Contested'
        LOST = 'lost', 'Lost'

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
    status = models.CharField(max_length=64, default=Situation.NEUTRAL, choices=Situation.choices, blank=True,
                              null=True)
    population = models.PositiveIntegerField(default=0, blank=True, null=True)
    population_details = models.CharField(max_length=512, default='', blank=True, null=True)
    camarilla_resources = models.PositiveIntegerField(default=0, blank=True, null=True)
    camarilla_intelligence = models.PositiveIntegerField(default=0, blank=True, null=True)
    camarilla_power = models.PositiveIntegerField(default=0, blank=True, null=True)
    camarilla_leisure = models.PositiveIntegerField(default=0, blank=True, null=True)

    def __str__(self):
        return f'{self.name} [{self.code}]'

    # def set_proeminent(self, value):
    #     self.proeminent = value
    #     self.color = CLAN_COLORS[value]

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
        palette = self.buildPalette(len(CLAN_COLORS)+1)
        per_clan = {}
        chronicle = get_current_chronicle()
        if chronicle:
            camarilla = Creature.objects.filter(chronicle=chronicle.acronym, faction__in=['Camarilla', 'Anarchs'],
                                                creature='kindred',
                                                hidden=False, district=self.code).order_by('-freebies')
            independents = Creature.objects.filter(chronicle=chronicle.acronym, faction='Independents',
                                                   creature='kindred',
                                                   hidden=False, district=self.code).order_by('-freebies')
            sabbat = Creature.objects.filter(chronicle=chronicle.acronym, faction='Sabbat', creature='kindred',
                                             hidden=False, district=self.code).order_by('-freebies')
            self.population_details = ''
            self.population = 0
            cama_pop = 0
            inde_pop = 0
            sabb_pop = 0
            for k in camarilla:
                col = CLAN_COLORS[k.family.lower().split(" ")[0]]
                print(col)
                self.population_details += f'<li><span class="camarilla">{k.name}</span> ({k.family} {k.freebies})</li>'
                self.population += 1
                cama_pop += k.freebies
                if k.family in per_clan:
                    per_clan[k.family] += k.freebies
                else:
                    per_clan[k.family] = k.freebies
            for k in independents:
                self.population_details += f'<li><span class="independents">{k.name}</span> ({k.freebies})</li>'
                self.population += 1
                inde_pop += k.freebies
            for k in sabbat:
                self.population_details += f'<li><span class="sabbat">{k.name}</span> ({k.freebies})</li>'
                self.population += 1
                inde_pop += k.freebies
            if inde_pop == 0:
                if cama_pop > 150:
                    self.status = 'full'
                elif cama_pop > 100:
                    self.status = 'controlled'
                elif cama_pop > 10:
                    self.status = 'presence'
                else:
                    self.status = 'neutral'
            else:
                if inde_pop > cama_pop:
                    self.status = 'lost'

                elif inde_pop > 50:
                    self.status = 'contested'
                else:
                    self.status = 'incursions'
            percents = []
            total = 0
            for pc,v in per_clan.items():
                total += v
            for pc,v in per_clan.items():
                print(pc,v)
                percents.append({"cnt":round(v["cnt"]/total),"color":v["idx"],"title":pc})

            pop_bar = ""
            idx = 0
            for w in percents:
                for x in range(w["cnt"]):
                    pop_bar += f'<span style="color:{palette[w["color"]]};" title="{w["title"]}">█</span>'
            self.population_details += f'<div>{pop_bar}</div>'

    def buildPalette(self,size=16):
        import colorsys
        palette = []
        for x in range(size):
            color = colorsys.hsv_to_rgb(1.0/(size+1)*x, 0.5, 0.5)
            palette.append(f"#{round(color[0]*255):02x}{round(color[1]*255):02x}{round(color[2]*255):02x}")
        return palette




# Actions

def status_full(modeladmin, request, queryset):
    for district in queryset:
        district.status = District.Situation.FULL
        district.save()
    short_description = 'Status: Full Camarilla Control'


def status_controlled(modeladmin, request, queryset):
    for district in queryset:
        district.status = District.Situation.CONTROLLED
        district.save()
    short_description = 'Status: Camarilla Controlled'


def status_presence(modeladmin, request, queryset):
    for district in queryset:
        district.status = District.Situation.PRESENCE
        district.save()
    short_description = 'Status: Camarilla Presence'


def status_neutral(modeladmin, request, queryset):
    for district in queryset:
        district.status = District.Situation.NEUTRAL
        district.save()
    short_description = 'Status: Neutral'


def status_incursions(modeladmin, request, queryset):
    for district in queryset:
        district.status = District.Situation.INCURSIONS
        district.save()
    short_description = 'Status: Non Camarilla Incursions'


def status_contested(modeladmin, request, queryset):
    for district in queryset:
        district.status = District.Situation.CONTESTED
        district.save()
    short_description = 'Status: Contested'


def status_lost(modeladmin, request, queryset):
    for district in queryset:
        district.status = District.Situation.LOST
        district.save()
    short_description = 'Status: Lost'


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
               status_full,
               status_controlled,
               status_presence,
               status_neutral,
               status_incursions,
               status_contested,
               status_lost
               ]
