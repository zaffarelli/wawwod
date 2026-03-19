from django.db import models
from django.contrib import admin
import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from collector.models.seasons import Season
import json

import logging

logger = logging.Logger(__name__)


class Adventure(models.Model):
    name = models.CharField(max_length=128, default="")
    chronicle = models.CharField(max_length=8, default='WOD', blank=True)
    season = models.CharField(max_length=8, default='DEF')
    season_order = models.IntegerField(default=0, blank=True)
    protagonists = models.TextField(default="", max_length=4096, blank=True)
    team = models.TextField(default="", max_length=1024, blank=True)
    acronym = models.CharField(max_length=32, default='', primary_key=True)
    notes = models.TextField(max_length=1024, default='', blank=True)
    players_starting_freebies = models.IntegerField(default=15, blank=True)
    is_current = models.BooleanField(default=False, blank=True)
    adventure_teaser = models.CharField(max_length=128, default='', blank=True)
    deeds_map_str = models.TextField(max_length=2048, default="", blank=True)

    DEED_SEP = "|"
    WORD_SEP = ";"

    def __str__(self):
        return f"{self.name}"

    @property
    def code(self):
        return self.acronym

    def string_to_deeds(self):
        import json
        deeds_map = []
        items = self.deeds_map_str.split(self.DEED_SEP)
        for item in items:
            deeds_map.append(item.strip())
        print("deeds map",deeds_map)
        return deeds_map

    def deeds_to_string(self, json_data_list):
        self.deeds_map_str = ""
        data = []
        for item in json_data_list:
            if len(item) > 0:
                data.append(item)
        self.deeds_map_str = self.DEED_SEP.join(data)

    def push_deed(self, json_deed):
        if json_deed.code not in self.deeds_map_str:
            former = self.string_to_deeds()
            former.append(json_deed)
            self.deeds_to_string(former)

    def pull_deed(self, code):
        found = None
        if code in self.deeds_map_str:
            deeds = self.string_to_deeds()
            for deed in deeds:
                if deed["code"] == code:
                    found = deed
                    break
        return found

    def update_deeds(self, code):
        result = ""
        if code in self.deeds_map_str:
            updated_deeds = []
            deeds = self.string_to_deeds()
            for deed in deeds:
                words = deed.split(self.WORD_SEP)
                if code != words[0]:
                    updated_deeds.append(deed)
                else:
                    result = f"{self.acronym}__{code}___off"
            self.deeds_to_string(updated_deeds)
        else:
            deeds = self.string_to_deeds()
            print(deeds)
            print(code)
            deeds.append(code)
            print(deeds)
            self.deeds_to_string(deeds)
            result = f"{self.acronym}__{code}___on"
        self.save()
        return result

    def fix(self):
        if self.protagonists == "":
            from collector.models.creatures import Creature
            pcs = Creature.objects.filter(adventure__contains=self.acronym, is_player=True)
            list = []
            for pc in pcs:
                list.append(pc.rid)
            self.protagonists = ",".join(list)
        if self.protagonists != "":
            self.team = ""
            team_list = []
            list = self.protagonists.split(",")
            from collector.models.creatures import Creature
            pcs = Creature.objects.filter(rid__in=list).order_by("groupspec")
            for pc in pcs:
                team_list.append(f"{pc.name} [{pc.player}]")
            self.team = ", ".join(team_list)
            # print(self.team)

    @classmethod
    def current_adventure(cls, se):
        adventure = None
        all = cls.objects.filter(is_current=True)
        if len(all) > 0:
            adventure = all.first()
        return adventure

    @classmethod
    def set_current(cls, ad=""):
        from collector.models.chronicles import Chronicle
        print(f"ad={ad}")
        all = cls.objects.filter()
        for adventure in all:
            adventure.is_current = False
            adventure.save()
        if len(ad) == 0:
            ad = "DEF90"
        currents = cls.objects.filter(acronym=ad)
        if len(currents) == 1:
            current = currents.first()
            current.is_current = True
            current.save()
            if Chronicle.current() != current.chronicle:
                print("Updating chronicle")
                Chronicle.set_current(current.chronicle)
            if Season.current() != current.season:
                Season.set_current(current.season)

    @classmethod
    def current(cls):
        all = cls.objects.filter(is_current=True)
        if len(all) == 1:
            return all.first()
        return None

    @classmethod
    def current_full(cls):
        all = cls.objects.filter(is_current=True)
        if len(all) == 1:
            from collector.models.chronicles import Chronicle
            adventure = all.first()
            chronicle = Chronicle.objects.filter(acronym=adventure.chronicle).first()
            season = Season.objects.filter(acronym=adventure.season).first()
            return adventure, chronicle, season
        return None, None, None


class AdventureAdmin(admin.ModelAdmin):
    list_display = ['acronym', 'name', 'season_order', 'is_current', 'season', 'chronicle', 'players_starting_freebies',
                    'team',
                    'notes']
    ordering = ['season', 'acronym']
    list_editable = ['name', 'is_current', 'chronicle', 'season_order', 'players_starting_freebies']
    from collector.utils.helper import refix
    actions = [refix]
