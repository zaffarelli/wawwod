from django.db import models
from django.contrib import admin
import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from collector.models.chronicles import Chronicle
import json

import logging

from collector.templatetags.wod_filters import as_tribe_plural, to_auspice_logo_single
from collector.utils.helper import toRID
from collector.utils.wod_reference import ALL_TRIBES

logger = logging.Logger(__name__)


class Sept(models.Model):
    name = models.CharField(max_length=128, primary_key=True)
    rid = models.CharField(max_length=128, blank=True)
    chronicle = models.CharField(max_length=8, default='WOD')
    season = models.CharField(max_length=8, default='DEF')
    garous = models.TextField(default="", max_length=4096, blank=True)
    kinfolks = models.TextField(default="", max_length=4096, blank=True)
    notes = models.TextField(max_length=1024, default='', blank=True)

    caern = models.CharField(default="", max_length=4096, blank=True)
    caern_level = models.PositiveIntegerField(default=1, blank=True)
    caern_type = models.CharField(default="", max_length=256, blank=True)
    caern_totem = models.CharField(default="", max_length=256, blank=True)
    treemap = models.TextField(max_length=8192*2, default='{}', blank=True)

    warder = models.CharField(default="", max_length=128, blank=True)
    grand_elder = models.CharField(default="", max_length=128, blank=True)
    elders = models.TextField(default="", max_length=1024, blank=True)
    guardians = models.TextField(default="", max_length=1024, blank=True)
    gatekeeper = models.CharField(default="", max_length=128, blank=True)
    master_of_the_rite = models.CharField(default="", max_length=128, blank=True)
    master_of_challenge = models.CharField(default="", max_length=128, blank=True)
    keeper_of_the_land = models.CharField(default="", max_length=128, blank=True)

    master_of_the_howl = models.CharField(default="", max_length=128, blank=True)
    caller_of_the_wild = models.CharField(default="", max_length=128, blank=True)
    truthcatcher = models.CharField(default="", max_length=128, blank=True)
    talesinger = models.CharField(default="", max_length=128, blank=True)
    wyrmfoe = models.CharField(default="", max_length=128, blank=True)
    auspices = models.CharField(default="0 0 0 0 0", max_length=128, blank=True)
    tribes = models.CharField(default="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0", max_length=128, blank=True)
    breeds = models.CharField(default="0 0 0", max_length=128, blank=True)

    def update_offices(self,garou):
        job = garou.community_job.lower()
        if job in ["warder", "grand_elder", "gatekeeper", "master_of_the_rite", "master_of_challenge",
                   "keeper_of_the_land", "wyrmfoe", "truthcatcher", "master_of_the_howl", "talesinger",
                   "caller_of_the_wyld"]:
            setattr(self, job, garou.rid)

        if job in ["grand_elder", "elder"]:
            self.elders = " "+garou.rid
        if job in ["guardian"]:
            self.guardians = " "+garou.rid

    def update_stats(self,garou):
        auspices = [int(x) for x in self.auspices.split(" ")]
        breeds = [int(x) for x in self.breeds.split(" ")]
        tribes = [int(x) for x in self.tribes.split(" ")]
        auspices[garou.auspice] += 1
        breeds[garou.breed] += 1
        plur = as_tribe_plural(garou.family)
        tidx = ALL_TRIBES.index(plur)
        if tidx>-1:
            tribes[tidx] += 1
        self.auspices = " ".join([str(x) for x in auspices])
        self.breeds = " ".join([str(x) for x in breeds])
        self.tribes = " ".join([str(x) for x in tribes])


    def build_statistics(self):
        statistics = {}
        statistics["auspices"] = [int(x) for x in self.auspices.split(" ")]
        statistics["breeds"] = [int(x) for x in self.breeds.split(" ")]
        statistics["tribes"] = [int(x) for x in self.tribes.split(" ")]
        return statistics

    def initialize_offices(self):
        all_jobs = ["warder", "grand_elder", "elders", "guardians","" "gatekeeper", "master_of_the_rite", "master_of_challenge",
                   "keeper_of_the_land", "wyrmfoe", "truthcatcher", "master_of_the_howl", "talesinger",
                   "caller_of_the_wyld"]
        for job in all_jobs:
            setattr(self, job, "")

    def build_offices(self):
        from collector.models.creatures import Creature
        offices = {}
        simple_jobs = ["warder", "grand_elder", "gatekeeper", "master_of_the_rite", "master_of_challenge",
                   "keeper_of_the_land", "wyrmfoe", "truthcatcher", "master_of_the_howl", "talesinger",
                   "caller_of_the_wyld"]
        team_jobs = ["elders", "guardians"]
        for job in simple_jobs:
            x = getattr(self,job)
            if x:
                garous = Creature.objects.filter(rid=x)
                if len(garous)==1:
                    garou = garous.first()
                    offices[job] = garou.name
                else:
                    offices[job] = "---"
        for job in team_jobs:
            x = getattr(self,job)
            if x:
                garous = Creature.objects.filter(rid__in=x)
                for garou in garous:
                    offices[job] += garou.name
        return offices

    def finalize_offices(self):
        elders = self.elders.split(" ")
        guardians = self.guardians.split(" ")
        self.elders = ", ".join(elders)
        self.guardians = ", ".join(guardians)


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
        from collector.templatetags.wod_filters import as_tribe_plural, to_tribe_logo_single
        self.tribes = "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
        self.breeds = "0 0 0"
        self.auspices = "0 0 0 0 0"
        data = {"name":self.name,"caern": {"name":self.caern, "type": self.caern_type, "level": self.caern_level, "totem": self.caern_totem}, "moonbridges": [], "offices": {},"statistics": {}, "packs": []}
        garous_rids = self.garous.split(", ")
        garous = Creature.objects.filter(creature="garou").filter(rid__in=garous_rids).order_by("groupspec")
        packs_summary = []
        packs = {}
        pack_counter = 0
        self.initialize_offices()
        for garou in garous:
            # print(garou, " (", garou.groupspec, ')')
            self.update_offices(garou)
            self.update_stats(garou)
            g = {
                "rid": garou.rid,
                "renown": garou.total_renown,
                "name": garou.name,
                "aka": garou.nickname,
                "age": garou.age,
                "edges": garou.edges_str,
                "kinfolks": garou.value_of("kinfolk"),
                "condition": garou.condition,
                "player": garou.player,
                "position": garou.community_job,
                "short_desc": garou.short_desc,
                "rank": garou.rank,
                "auspice": garou.auspice,
                "logo": to_tribe_logo_single(as_tribe_plural(garou.family)),
                "auspice_logo": to_auspice_logo_single(garou.auspice),
            }
            if garou.groupspec not in packs_summary:
                packs_summary.append(garou.groupspec)
                totem = garou.sire
                packs[f"pack_{pack_counter:02}"] = {"name": garou.groupspec, "members": [], "totem": totem}
                packs[f"pack_{pack_counter:02}"]["total_renown"] = garou.total_renown
                packs[f"pack_{pack_counter:02}"]["cnt"] = 1
                packs[f"pack_{pack_counter:02}"]["avg_renown"] = 0
                packs[f"pack_{pack_counter:02}"]["members"].append(g)
                pack_counter += 1
            else:
                for k, v in packs.items():
                    if v["name"] == garou.groupspec:
                        packs[k]["members"].append(g)
                        packs[k]["total_renown"] += garou.total_renown
                        packs[k]["cnt"] += 1
        packs_list = []
        for k, v in packs.items():
            packs_list.append(v)
        for x in packs_list:
            x["avg_renown"] = round(x["total_renown"]/x["cnt"])
        sorted_packs = sorted(packs_list, key=lambda k: k.get('avg_renown', 0), reverse=True)

        data["packs"] = sorted_packs

        data["offices"] = self.build_offices()
        data["statistics"] = self.build_statistics()

        self.finalize_offices()
        #print("data", data)
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
