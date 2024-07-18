from django.db import models
from django.contrib import admin
import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from collector.models.chronicles import Chronicle

import json

import logging

logger = logging.Logger(__name__)


class Season(models.Model):
    name = models.CharField(max_length=128, primary_key=True)
    chronicle = models.CharField(max_length=8, default='WOD')
    era = models.PositiveIntegerField(default=1985, blank=True)
    protagonists = models.CharField(default="", max_length=1024, blank=True)
    team = models.CharField(default="", max_length=1024, blank=True)
    acronym = models.CharField(max_length=32, default='', blank=True)
    notes = models.TextField(max_length=1024, default='', blank=True)

    # players_starting_freebies = models.IntegerField(default=15, blank=True)

    def __str__(self):
        return f"{self.name}"

    @property
    def code(self):
        return self.acronym

    def fix(self):
        from collector.models.adventures import Adventure
        self.protagonists = ""
        self.team = ""
        adventures = Adventure.objects.filter(season=self.acronym)
        for adventure in adventures:
            self.protagonists += adventure.protagonists
            self.team += adventure.team


class SeasonAdmin(admin.ModelAdmin):
    list_display = ['name', 'acronym','era', 'chronicle', 'team', 'protagonists', 'notes']
    ordering = ['-era']
    list_editable = ['acronym', 'notes','era']
    from collector.utils.helper import refix
    actions = [refix]
