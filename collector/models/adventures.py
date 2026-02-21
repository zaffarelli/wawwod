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
    name = models.CharField(max_length=128, primary_key=True)
    # chronicle = models.CharField(max_length=8, default='WOD')
    season = models.CharField(max_length=8, default='DEF')
    protagonists = models.TextField(default="", max_length=4096, blank=True)
    team = models.TextField(default="", max_length=1024, blank=True)
    acronym = models.CharField(max_length=32, default='', blank=True)
    notes = models.TextField(max_length=1024, default='', blank=True)
    players_starting_freebies = models.IntegerField(default=15, blank=True)
    is_current = models.BooleanField(default=False, blank=True)
    adventure_teaser = models.CharField(max_length=128, default='', blank=True)

    def __str__(self):
        return f"{self.name}"

    @property
    def code(self):
        return self.acronym

    def fix(self):
        if self.protagonists == "":
            from collector.models.creatures import Creature
            pcs = Creature.objects.filter(adventure=self.acronym)
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
        all = cls.objects.filter(season=se, is_current=True)
        if len(all) > 0:
            adventure = all.first()
        return adventure


class AdventureAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_current', 'acronym', 'season', 'players_starting_freebies', 'team', 'notes']
    ordering = ['season', 'acronym']
    list_editable = ['acronym', 'is_current', 'season', 'players_starting_freebies']
    from collector.utils.helper import refix
    actions = [refix]
