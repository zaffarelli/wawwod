from django.db import models
from django.contrib import admin
from collector.models.seasons import Season
import logging

logger = logging.getLogger(__name__)


class Adventure(models.Model):
    """
    Adventure model notes:
        - The player_starting_freebies is an amount added given to the freebies given by the creature type (e.g. to have garous starting with 21 freebies, just set players starting freebies to 6)
        - the separators are embedded in the model (used for deeds) because they should not be used manyually (methods do that).
    """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, default="")
    chronicle = models.CharField(max_length=8, default="WOD", blank=True)
    season = models.CharField(max_length=8, default="DEF")
    season_order = models.IntegerField(default=0, blank=True)
    protagonists = models.TextField(default="", max_length=4096, blank=True)
    team = models.TextField(default="", max_length=1024, blank=True)
    acronym = models.CharField(max_length=32, default="")
    notes = models.TextField(max_length=1024, default="", blank=True)
    players_starting_freebies = models.IntegerField(default=0, blank=True)
    is_current = models.BooleanField(default=False, blank=True)
    adventure_teaser = models.CharField(max_length=128, default="", blank=True)
    deeds_map_str = models.TextField(max_length=2048, default="", blank=True)
    new_acronym = models.CharField(max_length=32, default="", blank=True)
    watch = models.CharField(max_length=64, default="Perception+Alertness", blank=True)

    DEED_SEP = "|"
    WORD_SEP = ";"
    ITEM_SEP = "§"

    def __str__(self):
        return f"{self.name}"

    @property
    def code(self):
        return self.acronym

    def string_to_deeds(self):
        """
        returns: deed_map_str to a json structure
        """
        deeds_map = []
        items = self.deeds_map_str.split(self.DEED_SEP)
        for item in items:
            parts = item.strip().split(self.ITEM_SEP)
            s = {"code": parts[0], "players": []}
            if len(parts) > 1:
                for part in parts[1:]:
                    s["players"].append(part)
            deeds_map.append(s)
        return deeds_map

    def deeds_to_string(self, json_data_list):
        """
        Update deed_map_str from a list of json structures
        param json_data_list: the json structure list
        """
        self.deeds_map_str = ""
        all_deeds = []
        json_data_list.sort(key=lambda x: x["code"])
        for item in json_data_list:
            deed_string = item["code"]
            for player in item["players"]:
                deed_string += self.ITEM_SEP + player
            all_deeds.append(deed_string)
        print(all_deeds)

        self.deeds_map_str = self.DEED_SEP.join(all_deeds)

    def push_deed(self, json_deed):
        """
        Add a deed to the deed string
        param json_deed: the new deed structure
        """
        if json_deed["code"] in self.deeds_map_str:
            deeds = self.string_to_deeds()
            for deed in deeds:
                if deed["code"] == json_deed["code"]:
                    deeds.remove(deed)
            deeds.append(json_deed)
            self.deeds_to_string(deeds)

    def compute_individual_renown(self):
        """
        Add a deed to the deed string
        param json_deed: the new deed structure
        """
        from collector.models.creatures import Creature
        from collector.models.deeds import Deed
        pack = []
        protlist = self.protagonists.split(",")
        for protagonist in protlist:
            x = Creature.objects.filter(rid=protagonist).first()
            pack.append({"code": x.rid, "name": x.name, "glory": 0, "honor": 0, "wisdom": 0})
        deeds = self.string_to_deeds()
        for packmate in pack:
            for deed in deeds:
                if self.player_has_deed(packmate['code'], deed['code']):
                    deed_data = Deed.objects.get(code=deed['code'])
                    packmate["glory"] += deed_data.glory
                    packmate["honor"] += deed_data.honor
                    packmate["wisdom"] += deed_data.wisdom
        print(pack)
        return pack

    def pull_deed(self, code):
        """
        Fetch a specific deed identified by its code.
        :returns: the deed structure
        """
        found = None
        if code in self.deeds_map_str:
            deeds = self.string_to_deeds()
            for deed in deeds:
                print("*** pull_deed", deed)
                if deed["code"] == code:
                    found = deed
                    break
        return found

    def update_deeds(self, code):
        """
        Update deed selection for the list of deeds available for this adventure.
        Either add deed if not found, or remove it
        Each deed can be set once.
        """
        result = ""
        deeds = self.string_to_deeds()
        if code in self.deeds_map_str:
            for deed in deeds:
                if code == deed["code"]:
                    deed_to_remove = deed
                    result = f"{self.acronym}__{code}___off"
            deeds.remove(deed_to_remove)
            self.deeds_to_string(deeds)
            logger.info(f"Deed {code} removed")
        else:
            deeds.append({"code":code,"players":[]})
            self.deeds_to_string(deeds)
            result = f"{self.acronym}__{code}___on"
            logger.info(f"Deed {code} added")
        self.save()
        return result

    def record_deed(self, code, player):
        """
        Activate this deed for the player in this adventure
        """
        result = ""
        if code in self.deeds_map_str:
            deed = self.pull_deed(code)
            print("***", deed)
            if player in deed["players"]:
                deed["players"].remove(player)
                result = f"{self.acronym}__{code}__{player}____off"
            else:
                deed["players"].append(player)
                result = f"{self.acronym}__{code}__{player}____on"
            self.push_deed(deed)
        self.save()
        return result

    def player_has_deed(self, player_code, deed_code):
        res = False
        if deed_code in self.deeds_map_str:
            print(deed_code)
            deed = self.pull_deed(deed_code)
            print(deed)
            if player_code in deed["players"]:
                res = True
        return res

    def has_character(self, c):
        """
        Check if a character is part of this adventure by checking the creature.aventure property
        Be careful here to have discrete acronyms for the acronyms (avoid "toto" and "toto2" adventures, go for "toto1" and "toto2" instead)
        """
        res = False
        advs = c.adventure.split(" ")
        for adv in advs:
            if adv == self.acronym:
                res = True
                break
        return res

    def deeds_player_map(self):
        """
        returns: the json structure with players
        """
        ds = self.string_to_deeds()
        print(ds)
        pmap = {}
        for d in ds:
            items = d.split(self.ITEM_SEP)
            pmap[items[0]] = []
            for k, item in enumerate(items):
                if k > 0:
                    pmap[items[0]].append(item)
        return pmap

    def fix(self):
        if self.protagonists == "":
            from collector.models.creatures import Creature
            pcs = Creature.objects.filter(adventure__contains=self.acronym, is_player=True)
            list = []
            for pc in pcs:
                list.append(pc.rid)
            self.protagonists = ",".join(list)
        if self.protagonists != "":
            self.team = ""
            team_list = []
            list = self.protagonists.split(",")
            from collector.models.creatures import Creature

            pcs = Creature.objects.filter(rid__in=list).order_by("groupspec")
            for pc in pcs:
                team_list.append(f"{pc.name} [{pc.player}]")
            self.team = ", ".join(team_list)
            # print(self.team)
        if len(self.new_acronym) > 0:
            if self.new_acronym != self.acronym:
                self.acronym, self.new_acronym = self.new_acronym, self.acronym

    def post_fix(self):
        if self.new_acronym != self.acronym:
            from collector.models.creatures import Creature

            all_creatures = Creature.objects.all()
            found_once = False
            for creature in all_creatures:
                found = False
                re_acro = []
                advs = creature.adventure.split(" ")
                for adv in advs:
                    if adv != self.acronym and adv != self.new_acronym:
                        re_acro.append(adv)
                    else:
                        found = True
                        found_once = True
                if found:
                    creature.append(self.acronym)
                    creature.adventure = " ".join(re_acro)
                    creature.save()
            if found_once:
                self.acronym = self.new_acronym

    # @classmethod
    # def current_adventure(cls, se):
    #     adventure = None
    #     all = cls.objects.filter(is_current=True)
    #     if len(all) > 0:
    #         adventure = all.first()
    #     return adventure

    @classmethod
    def set_current(cls, ad=""):
        """
        Set current adventure (by switching the is_current property, off for all, then on to this one)
        If no adventure is given, falls back to the default adventure "DEF90"
        """
        from collector.models.chronicles import Chronicle
        all = cls.objects.filter()
        for adventure in all:
            adventure.is_current = False
            adventure.save()
        if len(ad) == 0:
            ad = "DEF90"
            logger.warning("Adventure not found. Falling back to default adventure.")
        currents = cls.objects.filter(acronym=ad)
        if len(currents) == 1:
            current = currents.first()
            current.is_current = True
            current.save()
            if Chronicle.current() != current.chronicle:
                print("Updating chronicle")
                Chronicle.set_current(current.chronicle)
            if Season.current() != current.season:
                Season.set_current(current.season)

    @classmethod
    def current(cls):
        """
        Get current adventure
        """
        all = cls.objects.filter(is_current=True)
        if len(all) == 1:
            return all.first()
        return None

    @classmethod
    def current_full(cls):
        """
        Shortcut for Adventure.current(), Chronicle.current(), Season.current()
        :returns: adventure, chronicle and season
        """
        all = cls.objects.filter(is_current=True)
        if len(all) == 1:
            from collector.models.chronicles import Chronicle

            adventure = all.first()
            chronicle = Chronicle.objects.filter(acronym=adventure.chronicle).first()
            season = Season.objects.filter(acronym=adventure.season).first()
            return adventure, chronicle, season
        return None, None, None


class AdventureAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "acronym",
        "watch",
        "name",
        "season_order",
        "is_current",
        "season",
        "chronicle",
        "players_starting_freebies",
        "team",
        "notes",
    ]
    ordering = ["season", "season_order", "acronym"]
    list_editable = [
        "name",
        "acronym",
        "watch",
        "is_current",
        "chronicle",
        "season_order",
        "players_starting_freebies",
    ]
    list_filter = ["season_order", "season"]
    from collector.utils.helper import refix

    actions = [refix]
