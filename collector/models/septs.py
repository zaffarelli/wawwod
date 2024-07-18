from django.db import models
from django.contrib import admin
import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from collector.models.chronicles import Chronicle
import json

import logging

from collector.utils.helper import toRID

logger = logging.Logger(__name__)


class Sept(models.Model):
    name = models.CharField(max_length=128, primary_key=True)
    rid = models.CharField(max_length=128, blank=True)
    chronicle = models.CharField(max_length=8, default='WOD')
    season = models.CharField(max_length=8, default='DEF')
    garous = models.CharField(default="", max_length=4096, blank=True)
    kinfolks = models.CharField(default="", max_length=4096, blank=True)
    notes = models.TextField(max_length=1024, default='', blank=True)

    caern = models.CharField(default="", max_length=4096, blank=True)
    caern_level = models.PositiveIntegerField(default=1, blank=True)
    caern_totem = models.CharField(default="", max_length=4096, blank=True)
    treemap = models.TextField(max_length=4096, default='{}', blank=True)

    def __str__(self):
        return f"{self.name}"

    def fix(self):
        if self.rid == "":
            self.rid = toRID(self.name)
        if self.chronicle:
            from collector.models.creatures import Creature
            protagonists = Creature.objects.filter(group=self.name, creature='garou')
            p = []
            for protagonist in protagonists:
                p.append(protagonist.rid)
            self.garous = ", ".join(p)

            from collector.models.creatures import Creature
            protagonists = Creature.objects.filter(group=self.name, creature='kinfolk')
            p = []
            for protagonist in protagonists:
                p.append(protagonist.rid)
            self.kinfolks = ", ".join(p)
        self.build_sept()

    def build_sept(self):
        from collector.models.creatures import Creature
        data = {"caern": {}, "moonbridges": [], "positions": {}, "packs": []}
        garous_rids = self.garous.split(", ")
        garous = Creature.objects.filter(creature="garou").filter(rid__in=garous_rids).order_by("groupspec")
        packs_summary = []
        packs = {}
        pack_counter = 0
        for garou in garous:
            print(garou, " (", garou.groupspec, ')')
            if garou.groupspec not in packs_summary:
                packs_summary.append(garou.groupspec)
                totem = garou.sire
                packs[f"pack_{pack_counter:02}"] = {"name": garou.groupspec, "members": [], "totem": totem}
                packs[f"pack_{pack_counter:02}"]["members"].append(garou.rid)
                pack_counter += 1
            else:
                for k, v in packs.items():
                    if v["name"] == garou.groupspec:
                        packs[k]["members"].append(garou.rid)
        packs_list = []
        for k, v in packs.items():
            packs_list.append(v)
        data["packs"] = packs_list

        print("data", data)
        self.treemap = json.dumps(data)
        return data


def refix(modeladmin, request, queryset):
    for sept in queryset:
        sept.save()
    short_description = 'Fix sept'


class SeptAdmin(admin.ModelAdmin):
    list_display = ['name', 'rid', 'chronicle', 'garous', "kinfolks", 'notes']
    ordering = ['chronicle', 'name']
    actions = [refix]
