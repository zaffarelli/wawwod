class FamilySolver:
    PLURALS = []
    SINGULARS = []
    WILLPOWERS = []
    RESTRICTIONS = []

    def __init__(self, creature=""):
        self.creature = creature

    def check(self, family=""):
        self.current = -1
        if len(family) > 0:
            for tribe in self.PLURALS:
                if tribe.lower() == family.lower():
                    self.current = self.PLURALS.index(tribe)
                    break
            if self.current == -1:
                for tribe in self.SINGULARS:
                    if tribe.lower() == family.lower():
                        self.current = self.SINGULARS.index(tribe)
                        break
        return self.current

    @property
    def plural(self):
        plural = None
        if self.current != -1:
            plural = self.PLURALS[self.current]
        return plural

    @property
    def willpower(self):
        return 1

    def info(self):
        data = {"creature": self.creature,
                "id": self.current,
                "plural": self.plural,
                "singular": self.plural,
                "willpower": self.willpower,
                "restrictions": self.restrictions}
        return data

    @property
    def singular(self):
        singular = None
        if self.current != -1:
            singular = self.SINGULARS[self.current]
        return singular

    @property
    def restrictions(self):
        restrictions = ""
        if self.current != -1:
            if len(self.RESTRICTIONS) - 1 > self.current:
                restrictions = self.RESTRICTIONS[self.current]
        return restrictions

    @classmethod
    def randomize(cls):
        from helper import roll
        alea = roll(faces=len(cls.PLURALS)) - 1
        plural = cls.PLURALS[alea]
        return plural

    @classmethod
    def all_plurals(cls):
        return cls.PLURALS

    @classmethod
    def all_singulars(cls):
        return cls.SINGULARS

class KindredFamilySolver(FamilySolver):
    PLURALS = [
        "Assamites", "Baalis", "Assamites Antitribu",
        "Blood Brothers", "Brujahs", "Brujahs Antitribu",
        "Caitiffs", "Cappadocians", "Gangrels",
        "Gangrels Antitribu", "Gargoyles", "Giovanni",
        "Harbingers Of Skulls", "Kiasyds", "Lasombras",
        "Lasombras Antitribu", "Malkavians", "Malkavians Antitribu",
        "Nosferatus", "Nosferatus Antitribu", "Panders",
        "Ravnos", "Ravnos Antitribu", "Salubris",
        "Salubris Antitribu", "Samedis", "Setites",
        "Setites Antitribu", "Toreadors", "Daughters Of Cacophony",
        "Toreadors Antitribu", "Tremeres", "True Brujahs",
        "Tzimisces", "Ventrues", "Ventrues Antitribu"
    ]

    SINGULARS = [
        "Assamite", "Baali", "Assamite Antitribu",
        "Blood Brother", "Brujah", "Brujah Antitribu",
        "Caitiff", "Cappadocian", "Gangrel",
        "Gangrel Antitribu", "Gargoyle", "Giovanni",
        "Harbinger Of Skulls", "Kiasyd", "Lasombra",
        "Lasombra Antitribu", "Malkavian", "Malkavian Antitribu",
        "Nosferatu", "Nosferatu Antitribu", "Pander",
        "Ravnos", "Ravnos Antitribu", "Salubri",
        "Salubri Antitribu", "Samedi", "Setite",
        "Setite Antitribu", "Toreador", "Daughter Of Cacophony",
        "Toreador Antitribu", "Tremere", "True Brujah",
        "Tzimisce", "Ventrue", "Ventrue Antitribu"
    ]

    WEAKNESS = [
        "Kindred blood addiction",  # Assamite
        "I do not know",  # Baali
        "Kindred blood addiction",  # Assamite Antitribu
        "No Embrace",  # Blood Brother
        "Short fuse",  # Brujah
        "Short fuse",  # Brujah Antitribu
        "",
        "Corpse Appeareance",
        "Animal traits",
        "Animal traits",
        "",
        "Painful kiss",
        "Corpse Appeareance",
        "Cold Iron Sensitive",
        "No reflection",
        "No reflection",
        "Derangement",
        "Derangement",
        "Hideous Appearence",
        "Hideous Appearence",
        "",
        "Vice addiction",
        "Vice addiction",
        "Must feed under passion",
        "Must feed under passion",
        "Hideous Appearence",
        "Light sensitive",
        "Light sensitive",
        "Fascination",
        "Fascination",
        "Fascination",
        "Blood thrall",
        "Short fuse",
        "Earth from the grave",
        "Prey Exclusive",
        "Prey Exclusive",
    ]

    DISCIPLINES = [
        ["Celerity (1)", "Obfuscate (1)", "Quietus (1)"],
        ["Dominate (1)", "Obfuscate (1)", "Potence (1)"],
        ["Celerity (1)", "Obfuscate (1)", "Quietus (1)"],
        ["Fortitude (1)", "Potence (1)", "Sanguinus (1)"],
        ["Celerity (1)", "Potence (1)", "Presence (1)"],
        ["Celerity (1)", "Potence (1)", "Presence (1)"],
        [],
        ["Auspex (1)", "Fortitude (1)", "Necromancy (1)"],
        ["Animalism (1)", " Fortitude (1)", "Protean (1)"],
        ["Celerity (1)", "Obfuscate (1)", "Protean (1)"],
        ["Fortitude (1)", "Potence (1)", "Visceratika (1)"],
        ["Dominate (1)", "Necromancy (1)", "Potence (1)"],
        ["Auspex (1)", "Fortitude (1)", "Necromancy (1)"],
        ["Dominate (1)", " Mytherceria (1)", "Obtenebration (1)"],
        ["Dominate (1)", "Obtenebration (1)", "Potence (1)"],
        ["Dominate (1)", "Obtenebration (1)", "Potence (1)"],
        ["Auspex (1)", "Dementation (1)", "Obfuscate (1)"],
        ["Auspex (1)", "Dementation (1)", "Obfuscate (1)"],
        ["Animalism (1)", "Obfuscate (1)", "Potence (1)"],
        ["Animalism (1)", "Obfuscate (1)", "Potence (1)"],
        [],
        ["Animalism (1)", "Chimerstry (1)", "Fortitude (1)"],
        ["Animalism (1)", "Chimerstry (1)", "Fortitude (1)"],
        ["Auspex (1)", "Fortitude (1)", "Obeah (1)"],
        ["Auspex (1)", "Fortitude (1)", "Valeren (1)"],
        ["Animalism (1)", "Obfuscate (1)", "Potence (1)"],
        ["Obfuscate (1)", "Presence (1)", "Serpentis (1)"],
        ["Obfuscate (1)", "Presence (1)", "Serpentis (1)"],
        ["Auspex (1)", "Celerity (1)", "Presence (1)"],
        ["Auspex (1)", "Celerity (1)", "Presence (1)"],
        ["Auspex (1)", "Celerity (1)", "Presence (1)"],
        ["Auspex (1)", "Dominate (1)", "Thaumaturgy (1)"],
        ["Temporis (1)", "Potence (1)", "Presence (1)"],
        ["Animalism (1)", "Auspex (1)", "Vicissitude (1)"],
        ["Dominate (1)", "Fortitude (1)", "Presence (1)"],
        ["Dominate (1)", "Fortitude (1)", "Presence (1)"]
    ]

    FACTION = [
        "Independent", "Sabbat", "Sabbat",
        "Sabbat", "Camarilla", "Sabbat",
        "Camarilla", "Independant", "Camarilla",
        "Sabbat", "Camarilla", "Independant",
        "Sabbat", "Independant", "Sabbat",
        "Camarilla", "Camarilla", "Sabbat",
        "Camarilla", "Sabbat", "Sabbat",
        "Independant", "Sabbat", "Independant",
        "Sabbat", "Sabbat", "Independant",
        "Sabbat", "Camarilla", "Camarilla",
        "Sabbat", "Camarilla", "Independant",
        "Sabbat", "Camarilla", "Sabbat"
    ]

    def __init__(self, clan=""):
        super().__init__("kindred")
        self.current = -1
        self.check(family=clan)

    @property
    def willpower(self):
        return None

    @property
    def disciplines(self):
        disciplines = None
        if self.current != -1:
            disciplines = self.DISCIPLINES[self.current]
        return disciplines

    @property
    def weakness(self):
        weakness = None
        if self.current != -1:
            weakness = self.WEAKNESS[self.current]
        return weakness

    def info(self):
        data = super().info()
        data["disciplines"] = self.disciplines
        data["weakness"] = self.weakness
        return data

    @property
    def all(self):
        data = []
        current = self.current
        for x in range(len(self.SINGULARS)):
            self.current = x
            data.append(super().info())
        self.current = current
        return data



class GarouFamilySolver(FamilySolver):
    """ Family solver for garous and kinfolks
    """
    PLURALS = ["Black Furies", "Black Spiral Dancers", "Bone Gnawers",
               "Bunyips", "Children of Gaia", "Croatans",
               "Fiannas", "Gets of Fenris", "Glass Walkers",
               "Red Talons", "Shadow Lords", "Silent Striders",
               "Silver Fangs", "Stargazers", "Uktenas",
               "Wendigos", "White Howlers"]
    SINGULARS = ["Black Fury", "Black Spiral Dancer", "Bone Gnawer",
                 "Bunyip", "Child of Gaia", "Croatan",
                 "Fianna", "Get of Fenris", "Glass Walker",
                 "Red Talons", "Shadow Lord", "Silent Strider",
                 "Silver Fangs", "Stargazer", "Uktena",
                 "Wendigo", "White Howler"]
    WILLPOWERS = [3, 3, 4,
                  3, 4, 3,
                  3, 3, 3,
                  3, 3, 3,
                  3, 4, 3,
                  4, 3]
    RESTRICTIONS = [
        "", "R:pure breed", "D:resources;R:ancestors,pure breed",
        "", "", "",
        "F:kinfolk", "D:contacts", "R:ancestor,pure breed;D:mentor",
        "D:allies,contact;R:resources", "D:allies,mentor", "R:ancestors;D:resources",
        "M:pure breed/3", "D:allies,fetish,resources", "",
        "D:contacts,resources", "",
    ]

    @property
    def willpower(self):
        wp = super().willpower()
        if self.current != -1:
            wp = 3
            if self.current in [2, 4, 13, 15]:
                wp = 4
        return wp

    def __init__(self, tribe=""):
        super().__init__("garou")
        self.current = -1
        self.check(family=tribe)

    @classmethod
    def randomize(cls, limit=""):
        if limit is "only_current_tribes":
            plurals_to_avoid = ["Black Spiral Dancers", "Bunyips", "Croatans", "White Howlers", ""]
        else:
            plurals_to_avoid = [""]
        from collector.utils.helper import roll
        plural = ""
        while plural in plurals_to_avoid:
            alea = roll(faces=len(cls.PLURALS)) - 1
            plural = cls.PLURALS[alea]
        return plural



    def info(self):
        data = super().info()
        data["willpower"] = self.willpower
        data["restrictions"] = self.restrictions
        return data


class KindredGenerationSolver:
    """ Generation solver especially for vampires
        Entry 0 will never be used, as Caine is supposed to be 1st generation
    """
    BLOODPOOLS = [666, 100, 100, 100, 70, 50, 30, 20, 15, 14, 13, 12, 11, 10]
    MAX_ATTR = [30, 10, 10, 10, 10, 9, 8, 7, 6, 5, 5, 5, 5, 5]
    generation = 13

    def __init__(self, generation_background=0):
        self.generation = 13 - generation_background

    @property
    def bloodpool(self):
        return self.BLOODPOOLS[self.generation]

    @property
    def attribute_max(self):
        return self.MAX_ATTR[self.generation]

    @property
    def textual_generation(self):
        if 3 == self.generation:
            suffix = "rd"
        elif 2 == self.generation:
            suffix = "nd"
        elif 1 == self.generation:
            suffix = "st"
        else:
            suffix = "th"
        txt = f"{self.generation}{suffix}"
        return txt


class CreatureSolver:
    # "mortal": {
    #     "attributes": "6/4/3",
    #     "abilities": "11/7/5",
    #     "traits": "0",
    #     "backgrounds": "5",
    #     "willpower": "3",
    #     "freebies": "21",
    # },

    creature = ""

    def __init__(self, creature=""):
        self.creature = creature