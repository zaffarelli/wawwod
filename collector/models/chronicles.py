from django.db import models
from django.contrib import admin

import logging

logger = logging.Logger(__name__)


class Chronicle(models.Model):
    refcode = models.IntegerField(default=0)
    name = models.CharField(max_length=128, default="", primary_key=True)
    acronym = models.CharField(max_length=16, blank=True, default="")
    era = models.IntegerField(default=2023)
    main_creature = models.CharField(max_length=128, blank=True, default="")
    players_starting_freebies = models.IntegerField(default=0, blank=True)
    image_logo = models.CharField(max_length=128, blank=True, default="")
    description = models.TextField(max_length=1024, blank=True, default="")
    is_current = models.BooleanField(default=False, blank=True)
    is_storyteller_only = models.BooleanField(default=False, blank=True)

    scenario = models.CharField(max_length=128, blank=True, default="")
    pre_title = models.CharField(max_length=128, blank=True, default="")
    post_title = models.CharField(max_length=128, blank=True, default="")

    @property
    def code(self):
        return self.acronym

    @property
    def population(self):
        from collector.models.creatures import Creature

        all = Creature.objects.filter(chronicle=self.acronym)
        return len(all)

    def population_of(self, creature=None):
        from collector.models.creatures import Creature

        if creature is None:
            all = Creature.objects.filter(chronicle=self.acronym)
        else:
            all = Creature.objects.filter(chronicle=self.acronym, creature=creature)
        return len(all)

    def __str__(self):
        return self.acronym

    @property
    def adventures(self):
        from collector.models.adventures import Adventure

        return Adventure.objects.filter(chronicle=self.acronym).order_by(
            "season", "season_order"
        )

    @classmethod
    def set_current(cls, ch=""):
        print(f"ch={ch}")
        if Chronicle.current().acronym != ch:
            all = cls.objects.all()
            for c in all:
                c.is_current = False
                c.save()
            if ch == "":
                ch = "WOD"
            currents = cls.objects.filter(acronym=ch)
            if len(currents) == 1:
                c = currents.first()
                c.is_current = True
                c.save()
                from collector.models.adventures import Adventure

                adventures = Adventure.objects.filter(chronicle=c.acronym)
                adventure = adventures.first()
                if Adventure.current != adventure:
                    Adventure.set_current(adventure.acronym)

    @classmethod
    def current(cls):
        all = cls.objects.filter(is_current=True)
        if len(all) == 1:
            return all.first()
        return None

    @property
    def to_json(self):
        data = {}
        data["name"] = self.name
        data["acronym"] = self.acronym
        data["is_current"] = self.is_current
        return data

    @classmethod
    def reid(cls):
        for n, x in enumerate(cls.objects.all()):
            x.refcode = n + 1
            x.save()


class ChronicleAdmin(admin.ModelAdmin):
    list_display = [
        "refcode",
        "acronym",
        "is_current",
        "name",
        "description",
        "main_creature",
        "population",
        "is_storyteller_only",
    ]
    list_editable = ["is_current", "is_storyteller_only"]
    ordering = ["acronym"]
    from collector.utils.helper import refix

    actions = [refix]
