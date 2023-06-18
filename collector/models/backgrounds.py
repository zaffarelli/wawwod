from django.db import models
from django.contrib import admin

import logging

logger = logging.Logger(__name__)


class Background(models.Model):
    code = models.CharField(max_length=128, default='?', primary_key=True)
    name = models.CharField(max_length=128, default='')
    level = models.PositiveIntegerField(default=1, blank=True)
    description = models.TextField(max_length=256, blank=True, default='')
    cumulate = models.BooleanField(default=False, blank=True)

    def fix(self):
        self.code = f'{self.name.title()} ({self.level})'

    def __str__(self):
        return f'{self.code})'


def refix(modeladmin, request, queryset):
    for background in queryset:
        background.fix()
        background.save()
    short_description = 'Fix background'


class BackgroundAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'level', 'description','cumulate' ]
    ordering = ['code']
    list_filter = ['name', 'level']
    search_fields = ['name', 'description']
    # list_editable = ['cumulate']
    actions = [refix]
