from django.db import models
from django.contrib import admin
from datetime import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
import json

class Rite(models.Model):
    refcode = models.IntegerField(default=0)
    code = models.CharField(max_length=256, default='', blank=True)
    name = models.CharField(max_length=128, default='', primary_key=True)
    path = models.CharField(max_length=128, default='', blank=True)
    level = models.PositiveIntegerField(default=0)
    creature = models.CharField(max_length=32, default='', blank=True)
    page = models.CharField(max_length=16, default='', blank=True)
    description = models.TextField(max_length=4096, blank=True, default='')
    system = models.TextField(max_length=4096, blank=True, default='')

    def fix(self):
        self.code = f'{self.name} ({self.level})'

    def __str__(self):
        return f'{self.name} ({self.level})'

    @classmethod
    def reid(cls):
        for n,x in enumerate(cls.objects.all()):
            x.refcode = n+1
            x.save()


class RiteAdmin(admin.ModelAdmin):
    list_display = ['refcode', 'name','code', 'level', 'path', 'description', "system"]
    ordering = ['path', 'level', 'name']
    list_filter = ['level','creature','path']
    search_fields = ['name','description']
    from collector.utils.helper import refix
    actions = [refix]