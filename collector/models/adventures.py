from django.db import models
from django.contrib import admin
from datetime import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from collector.models.chronicles import Chronicle
import json

import logging

logger = logging.Logger(__name__)


class Adventure(models.Model):
    name = models.CharField(max_length=128, default='', primary_key=True)
    chronicle = models.ForeignKey(Chronicle, on_delete=models.CASCADE, null=True, default=None)

    def __str__(self):
        return self.name


class AdventureAdmin(admin.ModelAdmin):
    list_display = ['name', 'chronicle']
    ordering = ['name']
