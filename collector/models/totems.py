from django.db import models
from django.contrib import admin
import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from collector.models.chronicles import Chronicle

import json
import hashlib
import logging

logger = logging.Logger(__name__)


class Totem(models.Model):
    name = models.CharField(max_length=128, default='')
    code = models.CharField(max_length=32, default='', blank=True)
    description = models.TextField(max_length=1024, default='', blank=True)
    ban = models.TextField(max_length=1024, default='', blank=True)
    individual_traits = models.CharField(max_length=256, default='', blank=True)
    pack_traits = models.CharField(max_length=256, default='', blank=True)
    background_cost = models.PositiveIntegerField(default=5, blank=True)

    def __str__(self):
        return f"{self.name}"

    @property
    def individual_traits_string(self):
        pass

    def fix(self):
        if len(self.code)==0:
            h = hashlib.blake2b(digest_size=17)
            h.update(bytes('totem_'+self.name.title(),'utf-8'))
            self.code = h.hexdigest()




class TotemAdmin(admin.ModelAdmin):
    list_display = ['name', 'code','description', 'ban', 'individual_traits', 'pack_traits', 'background_cost']
    ordering = ['name']
    list_editable = ['code','individual_traits', 'pack_traits','background_cost', 'ban' ]
    from collector.utils.helper import refix
    actions = [refix]
