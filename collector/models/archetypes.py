from django.db import models
from django.contrib import admin
from datetime import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
import json


class Archetype(models.Model):
    name = models.CharField(max_length=128, default='', primary_key=True)
    source = models.CharField(max_length=32, default='VTM3', blank=True)
    description = models.TextField(max_length=1024, blank=True, default='')
    system = models.TextField(max_length=1024, blank=True, default='')

    def __str__(self):
        return f'{self.name}'


class ArchetypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'source', 'description', 'system']
    ordering = ['source', 'name']
    list_filter = ['source']
    search_fields = ['name', 'system', 'description']
    list_editable = ['source', 'description', 'system']
