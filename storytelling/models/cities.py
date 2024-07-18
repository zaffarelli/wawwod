from django.db import models
from django.contrib import admin

from collector.models.chronicles import Chronicle
from storytelling.models.stories import Story
from collector.utils.helper import json_default
import json
import logging

logger = logging.Logger(__name__)


class City(models.Model):
    class Meta:
        verbose_name_plural = 'Cities'
    name = models.CharField(max_length=128, default='')
    chronicle = models.CharField(max_length=8, default='WOD')
    code = models.CharField(max_length=2, default='')
    description = models.TextField(max_length=1024, default='')

    def __str__(self):
        return f'{self.name}'

    def toJSON(self):
        jstr = json.dumps(self, default=json_default, sort_keys=True, indent=4)
        return jstr




class CityAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'description']
    ordering = ['name']
    search_fields = ['name', 'code', 'description']
