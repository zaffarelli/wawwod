from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
import logging

from collector.views.base import adventure_sheet

logger = logging.getLogger(__name__)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    dashboard_watch_criteria = models.CharField(max_length = 100, default="Dexterity+Brawl", blank=True)
    storyteller_for = models.TextField(max_length = 512, default="", blank=True)
    characters = models.TextField(max_length=512, default="", blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "dashboard_watch_criteria", "storyteller_for", "characters"]
    list_editable = ["dashboard_watch_criteria", "storyteller_for", "characters"]
    ordering = ["user"]

