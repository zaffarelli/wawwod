from django.db import models
from django.contrib import admin
from datetime import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
import json

class Rite(models.Model):
    name = models.CharField(max_length=128, default='', primary_key=True)
    path = models.CharField(max_length=128, default='', blank=True)
    level = models.PositiveIntegerField(default=0)
    creature = models.CharField(max_length=32, default='', blank=True)
    declaration = models.CharField(max_length=256, default='', blank=True)
    description = models.TextField(max_length=1024, blank=True, default='')

    def fix(self):
        self.declaration = f'{self.name} ({self.level})'

    def __str__(self):
        return f'{self.name} ({self.level})'

def refix(modeladmin, request, queryset):
    for rite in queryset:
        rite.fix()
        rite.save()
    short_description = 'Fix gift'

class RiteAdmin(admin.ModelAdmin):
    list_display = ['name','declaration', 'level', 'path', 'description']
    ordering = ['path', 'level', 'name']
    list_filter = ['level','path']
    search_fields = ['name','description']
    actions = [refix]
