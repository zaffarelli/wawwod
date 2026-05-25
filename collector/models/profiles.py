from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
import logging

from collector.models.adventures import Adventure
from collector.views.base import adventure_sheet

logger = logging.getLogger('wawwod')


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    dashboard_watch_criteria = models.CharField(max_length = 100, default="Dexterity+Brawl", blank=True)
    storyteller_for = models.TextField(max_length = 512, default="", blank=True)
    characters = models.TextField(max_length=512, default="", blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

    @property
    def player_of_current(self):
        from collector.models.adventures import Adventure
        from collector.models.creatures import Creature
        is_in = False
        adventure, chronicle, season = Adventure.current_full()
        characters = self.characters.split(", ")
        for character in characters:
            if len(character) > 0:
                c = Creature.objects.get(rid=character)
                if chronicle.acronym in c.chronicle:
                    is_in = True
                    break
        return is_in

    @property
    def storyteller_of_current(self):
        from collector.models.adventures import Adventure
        is_in = False
        adventure, chronicle, season = Adventure.current_full()
        chronicles = self.storyteller_for.split(", ")
        if chronicle in chronicles:
            is_in = True
        return is_in


class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "dashboard_watch_criteria", "storyteller_for", "characters"]
    list_editable = ["dashboard_watch_criteria", "storyteller_for", "characters"]
    ordering = ["user"]

