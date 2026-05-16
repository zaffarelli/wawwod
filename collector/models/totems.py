from django.db import models
from django.contrib import admin
import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from collector.models.chronicles import Chronicle

import json
import hashlib
import logging

logger = logging.getLogger('wawwod')


class Totem(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, default="", blank=True)
    jaggling_name = models.CharField(max_length=128, default="", blank=True)
    code = models.CharField(max_length=32, default="", blank=True)
    type = models.CharField(max_length=16, default="HON", choices = [("HON","Honor"),("CUN","Cunning"),("WAR","War"),("WIS","Wisdom")], blank=True)
    description = models.TextField(max_length=1024, default="", blank=True)
    granted_powers = models.TextField(max_length=1024, default="", blank=True)
    ban = models.TextField(max_length=1024, default="", blank=True)
    individual_traits = models.CharField(max_length=256, default="", blank=True)
    pack_traits = models.CharField(max_length=256, default="", blank=True)
    background_cost = models.PositiveIntegerField(default=5, blank=True)
    brood = models.CharField(max_length=128, default="", blank=True)

    def __str__(self):
        return f"{self.name}"


    def fix(self):
        if len(self.code) == 0:
            # h = hashlib.blake2b(digest_size=17)
            # h.update(bytes("totem_" + self.name.title(), "utf-8"))
            # self.code = h.hexdigest()
            # from collector.utils.helper import toRID
            self.code = toRID(self.name)
        print(self.roster_text())


    @property
    def individual_traits_string(self):
        lines = []
        entries = self.individual_traits.split(";")
        lines.append(f"Individual Traits:")
        for entry in entries:
            if len(entry) > 0:
                items = entry.strip().split("=")
                lines.append(f"- {items[0]} {items[1]} point(s)")
        return "\n".join(lines)

    @property
    def pack_traits_string(self):
        lines = []
        entries = self.pack_traits.split(";")
        lines.append(f"Pack Traits:")
        for entry in entries:
            if len(entry) > 0:
                items = entry.strip().split("=")
                lines.append(f"- {items[0]} {items[1]} dice")
        return "\n".join(lines)


    def roster_text(self):
        lines = []
        lines.append(f"{self.jaggling_name} the {self.name}")
        lines.append(f"Brood: {self.brood} ({self.get_type_display()})")
        lines.append(f"{self.description}")
        lines.append(f"{self.individual_traits_string}")
        lines.append(f"{self.pack_traits_string}")
        lines.append(f"Ban: {self.ban}")
        lines.append(f"Base Cost: {self.background_cost}")
        return "\n".join(lines)


class TotemAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "jaggling_name",
        "brood",
        "type",
        "code",
        "description",
        "granted_powers",
        "ban",
        "individual_traits",
        "pack_traits",
        "background_cost",

    ]
    ordering = ["name"]
    list_editable = [
        "jaggling_name",
        "individual_traits",
        "brood",
        "type",
        "granted_powers",
        "pack_traits",
        "background_cost",
        "ban",
        "brood",
    ]
    from collector.utils.helper import refix

    actions = [refix]
