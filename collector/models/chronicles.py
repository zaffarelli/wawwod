from django.db import models
from django.contrib import admin
from datetime import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
import json

import logging

logger = logging.Logger(__name__)


class Chronicle(models.Model):
    name = models.CharField(max_length=128, default='', primary_key=True)
    acronym = models.CharField(max_length=16, blank=True, default='')
    era = models.IntegerField(default=2023)
    main_creature = models.CharField(max_length=128, blank=True, default='')
    players_starting_freebies = models.IntegerField(default=0, blank=True)
    image_logo = models.CharField(max_length=128, blank=True, default='')
    description = models.TextField(max_length=1024, blank=True, default='')
    is_current = models.BooleanField(default=False, blank=True)
    is_storyteller_only = models.BooleanField(default=False, blank=True)

    @property
    def population(self):
        from collector.models.creatures import Creature
        all = Creature.objects.filter(chronicle=self.acronym)
        return len(all)

    def population_of(self, creature=None):
        from collector.models.creatures import Creature
        if creature is None:
            all = Creature.objects.filter(chronicle=self.acronym)
        else:
            all = Creature.objects.filter(chronicle=self.acronym, creature=creature)
        return len(all)

    def __str__(self):
        return self.acronym


class ChronicleAdmin(admin.ModelAdmin):
    list_display = ['acronym', 'name', 'description', 'main_creature', 'is_current', 'population','is_storyteller_only']
    list_editable = ['is_current','is_storyteller_only']
    ordering = ['acronym']
