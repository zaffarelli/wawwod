from django.db import models
from django.contrib import admin
import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from collector.models.chronicles import Chronicle
import json

import logging

logger = logging.Logger(__name__)


class Adventure(models.Model):
    name = models.CharField(max_length=128, primary_key=True)
    chronicle = models.ForeignKey(Chronicle, on_delete=models.CASCADE, null=True, default=None)
    protagonists = models.CharField(default="", max_length=1024, blank=True)
    team = models.CharField(default="", max_length=1024, blank=True)
    code = models.CharField(max_length=32,default='', blank=True)
    notes = models.TextField(max_length=1024,default='', blank=True)

    def __str__(self):
        return self.name

    def fix(self):
        if self.code == '':
            if self.chronicle:
                all_adventures = Adventure.objects.filter(chronicle=self.chronicle)
                self.code = f'{self.chronicle.acronym}_{len(all_adventures):03}'
        if self.protagonists == "":
            from collector.models.creatures import Creature
            pcs = Creature.objects.filter(adventure=self)
            for pc in pcs:
                self.protagonists += f"{pc.rid}, "
        if self.protagonists != "":
            self.team = ""
            list = self.protagonists.split(", ")
            from collector.models.creatures import Creature
            pcs = Creature.objects.filter(rid__in=list)
            for pc in pcs:
                self.team += f"{pc.name} [{pc.player}]\n"


class AdventureAdmin(admin.ModelAdmin):
    list_display = ['name','code', 'chronicle', 'protagonists', 'team', 'notes']
    ordering = ['code']
    list_editable = ['code','protagonists', 'notes']
