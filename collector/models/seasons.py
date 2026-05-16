from django.db import models
from django.contrib import admin
import logging

logger = logging.getLogger('wawwod')


class Season(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, unique=True)
    era = models.PositiveIntegerField(default=1985, blank=True)
    protagonists = models.CharField(default="", max_length=1024, blank=True)
    team = models.CharField(default="", max_length=1024, blank=True)
    acronym = models.CharField(max_length=32, default="", blank=True)
    notes = models.TextField(max_length=1024, default="", blank=True)
    is_current = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return f"{self.name}"

    @property
    def code(self):
        return self.acronym

    def fix(self):
        from collector.models.adventures import Adventure

        self.protagonists = ""
        self.team = ""
        adventures = Adventure.objects.filter(season=self.acronym)
        for adventure in adventures:
            self.protagonists += adventure.protagonists
            self.team += adventure.team

    @classmethod
    def current_season(cls, ch=""):
        season = None
        all = cls.objects.filter(is_current=True)
        if len(all) > 0:
            season = all.first()
        return season

    @classmethod
    def set_current(cls, se=""):
        all = cls.objects.filter()
        for c in all:
            c.is_current = False
            c.save()
        if se == "":
            se = "DEF"
        currents = cls.objects.filter(acronym=se)
        if len(currents) == 1:
            current = currents.first()
            current.is_current = True
            current.save()

    @classmethod
    def current(cls):
        all = cls.objects.filter(is_current=True)
        if len(all) == 1:
            return all.first()
        return None

    @property
    def adventures(self):
        from collector.models.adventures import Adventure

        return Adventure.objects.filter(season=self.acronym)


class SeasonAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "is_current", "acronym", "era", "team", "notes"]
    ordering = ["-era"]
    list_editable = ["acronym", "is_current", "era"]
    from collector.utils.helper import refix
    actions = [refix]
