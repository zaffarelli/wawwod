from django.db import models
from django.contrib import admin
import json
import logging
from collector.utils.wod_reference import get_current_chronicle, find_stat_property, STATS_NAMES, GM_SHORTCUTS, \
    bloodpool, STATS_TEMPLATES, ARCHETYPES, CLANS_SPECIFICS
from collector.utils.helper import json_default, toRID
import random

logger = logging.Logger(__name__)
chronicle = get_current_chronicle()


# GAROU_TALENTS = ["Alertness", "Athletics", "Brawl", "Dodge", "Empathy", "Expression", "Intimidation", "Primal-Urge",
#                  "Streetwise", "Subterfuge"]
# GAROU_SKILLS = ["Animal Ken", "Crafts", "Drive", "Etiquette", "Firearms", "Leadership", "Melee", "Performance",
#                 "Stealth", "Survival"]
# GAROU_KNOWLEDGES = ["Computer", "Enigmas", "Investigation", "Law", "Linguistics", "Medicine", "Occult", "Politics",
#                     "Rituals", "Science"]
# GAROU_BACKGROUNDS = ["Allies", "Ancestors", "Contacts", "Fetish", "Kinfolk", "Mentor", "Pure Breed", "Resources",
#                      "Rites", "Totem"]


class Creature(models.Model):
    class Meta:
        verbose_name = 'Creature'
        ordering = ['name']

    player = models.CharField(max_length=32, blank=True, default='')
    name = models.CharField(max_length=128, default='')
    new_name = models.CharField(max_length=128, default='', blank=True, null=True)
    rid = models.CharField(max_length=128, blank=True, default='')
    nickname = models.CharField(max_length=128, blank=True, default='')
    primogen = models.BooleanField(default=False)
    mythic = models.BooleanField(default=False)
    family = models.CharField(max_length=32, blank=True, default='')
    auspice = models.PositiveIntegerField(default=0)
    breed = models.PositiveIntegerField(default=0)
    domitor = models.CharField(max_length=128, blank=True, default='')
    group = models.CharField(max_length=128, blank=True, default='')
    groupspec = models.CharField(max_length=128, blank=True, default='')
    concept = models.CharField(max_length=128, blank=True, default='')
    age = models.PositiveIntegerField(default=0)
    trueage = models.PositiveIntegerField(default=0)
    embrace = models.IntegerField(default=0)
    faction = models.CharField(max_length=64, blank=True, default='')
    lastmod = models.DateTimeField(auto_now=True)
    chronicle = models.CharField(max_length=8, default='NYBN')
    creature = models.CharField(max_length=20, default='kindred')
    sex = models.BooleanField(default=False)
    display_gauge = models.IntegerField(default=0)
    display_pole = models.CharField(max_length=64, default='', blank=True)

    finaldeath = models.IntegerField(default=0)
    timeintorpor = models.PositiveIntegerField(default=0)
    picture = models.CharField(max_length=128, blank=True, default='')
    sire = models.CharField(max_length=64, blank=True, default='')
    patron = models.CharField(max_length=64, blank=True, default='')
    rank = models.CharField(max_length=32, blank=True, default='')
    topic = models.TextField(max_length=1024, blank=True, default='')
    status = models.CharField(max_length=32, blank=True, default='OK')
    position = models.CharField(max_length=64, blank=True, default='')
    maj = models.PositiveIntegerField(default=0)
    need_fix = models.BooleanField(default=False)
    is_new = models.BooleanField(default=True)
    freebiedif = models.IntegerField(default=0)
    freebies = models.IntegerField(default=0, blank=True)
    expectedfreebies = models.IntegerField(default=0)
    disciplinepoints = models.IntegerField(default=0)
    experience = models.IntegerField(default=0)
    extra = models.IntegerField(default=0)
    hidden = models.BooleanField(default=False)
    ghost = models.BooleanField(default=False)
    source = models.CharField(max_length=64, blank=True, default='zaffarelli')
    total_physical = models.IntegerField(default=0)
    total_social = models.IntegerField(default=0)
    total_mental = models.IntegerField(default=0)
    total_talents = models.IntegerField(default=0)
    total_skills = models.IntegerField(default=0)
    total_knowledges = models.IntegerField(default=0)
    total_backgrounds = models.IntegerField(default=0)
    total_traits = models.IntegerField(default=0)
    total_passions = models.IntegerField(default=0)
    total_fetters = models.IntegerField(default=0)
    total_realms = models.IntegerField(default=0)

    nature = models.CharField(max_length=32, blank=True, default='')
    demeanor = models.CharField(max_length=32, blank=True, default='')
    condition = models.CharField(max_length=32, blank=True, default='OK')
    territory = models.CharField(max_length=128, blank=True, default='')
    weakness = models.CharField(max_length=128, blank=True, default='')

    # All
    willpower = models.PositiveIntegerField(default=1)

    #CTD
    glamour = models.PositiveIntegerField(default=0)
    banality = models.PositiveIntegerField(default=0)
    nightmare = models.PositiveIntegerField(default=0)
    realm0 = models.CharField(max_length=64, blank=True, default='')
    realm1 = models.CharField(max_length=64, blank=True, default='')
    realm2 = models.CharField(max_length=64, blank=True, default='')
    realm3 = models.CharField(max_length=64, blank=True, default='')
    realm4 = models.CharField(max_length=64, blank=True, default='')
    legacies = models.CharField(max_length=64, blank=True, default='')
    birthright0 = models.CharField(max_length=64, blank=True, default='')
    birthright1 = models.CharField(max_length=64, blank=True, default='')
    birthright2 = models.CharField(max_length=64, blank=True, default='')
    birthright3 = models.CharField(max_length=64, blank=True, default='')
    birthright4 = models.CharField(max_length=64, blank=True, default='')
    anthithesis = models.CharField(max_length=64, blank=True, default='')
    house = models.CharField(max_length=64, blank=True, default='')
    motley = models.CharField(max_length=64, blank=True, default='')
    seeming = models.CharField(max_length=64, blank=True, default='')


    # VTM
    path = models.CharField(max_length=64, default='Humanity')
    humanity = models.PositiveIntegerField(default=0)
    bloodpool = models.PositiveIntegerField(default=0)
    virtue0 = models.PositiveIntegerField(default=0)
    virtue1 = models.PositiveIntegerField(default=0)
    virtue2 = models.PositiveIntegerField(default=0)

    # WTA
    gnosis = models.PositiveIntegerField(default=0)
    rage = models.PositiveIntegerField(default=0)
    glory = models.PositiveIntegerField(default=0)
    honor = models.PositiveIntegerField(default=0)
    wisdom = models.PositiveIntegerField(default=0)

    # MTA
    arete = models.PositiveIntegerField(default=0)
    quintessence = models.PositiveIntegerField(default=0)
    paradox = models.PositiveIntegerField(default=0)
    dynamic = models.PositiveIntegerField(default=0)
    entropic = models.PositiveIntegerField(default=0)
    static = models.PositiveIntegerField(default=0)

    #WTO
    corpus = models.PositiveIntegerField(default=0)
    pathos = models.PositiveIntegerField(default=0)
    regret = models.CharField(max_length=64, blank=True, default='')
    passion0 = models.CharField(max_length=64, blank=True, default='')
    passion1 = models.CharField(max_length=64, blank=True, default='')
    passion2 = models.CharField(max_length=64, blank=True, default='')
    passion3 = models.CharField(max_length=64, blank=True, default='')
    passion4 = models.CharField(max_length=64, blank=True, default='')
    fetter0 = models.CharField(max_length=64, blank=True, default='')
    fetter1 = models.CharField(max_length=64, blank=True, default='')
    fetter2 = models.CharField(max_length=64, blank=True, default='')
    fetter3 = models.CharField(max_length=64, blank=True, default='')
    fetter4 = models.CharField(max_length=64, blank=True, default='')

    angst = models.PositiveIntegerField(default=0)
    psyche_willpower = models.PositiveIntegerField(default=0)
    psyche = models.CharField(max_length=32, blank=True, default='')
    psyche_archetype = models.CharField(max_length=32, blank=True, default='')
    darkpassion0 = models.CharField(max_length=64, blank=True, default='')
    darkpassion1 = models.CharField(max_length=64, blank=True, default='')
    darkpassion2 = models.CharField(max_length=64, blank=True, default='')
    darkpassion3 = models.CharField(max_length=64, blank=True, default='')
    darkpassion4 = models.CharField(max_length=64, blank=True, default='')
    thorn0 = models.CharField(max_length=64, blank=True, default='')
    thorn1 = models.CharField(max_length=64, blank=True, default='')
    thorn2 = models.CharField(max_length=64, blank=True, default='')
    thorn3 = models.CharField(max_length=64, blank=True, default='')
    thorn4 = models.CharField(max_length=64, blank=True, default='')



    summary = models.TextField(default='', blank=True, max_length=2048)
    attribute0 = models.PositiveIntegerField(default=1)
    attribute1 = models.PositiveIntegerField(default=1)
    attribute2 = models.PositiveIntegerField(default=1)
    attribute3 = models.PositiveIntegerField(default=1)
    attribute4 = models.PositiveIntegerField(default=1)
    attribute5 = models.PositiveIntegerField(default=1)
    attribute6 = models.PositiveIntegerField(default=1)
    attribute7 = models.PositiveIntegerField(default=1)
    attribute8 = models.PositiveIntegerField(default=1)
    talent0 = models.PositiveIntegerField(default=0)
    talent1 = models.PositiveIntegerField(default=0)
    talent2 = models.PositiveIntegerField(default=0)
    talent3 = models.PositiveIntegerField(default=0)
    talent4 = models.PositiveIntegerField(default=0)
    talent5 = models.PositiveIntegerField(default=0)
    talent6 = models.PositiveIntegerField(default=0)
    talent7 = models.PositiveIntegerField(default=0)
    talent8 = models.PositiveIntegerField(default=0)
    talent9 = models.PositiveIntegerField(default=0)
    skill0 = models.PositiveIntegerField(default=0)
    skill1 = models.PositiveIntegerField(default=0)
    skill2 = models.PositiveIntegerField(default=0)
    skill3 = models.PositiveIntegerField(default=0)
    skill4 = models.PositiveIntegerField(default=0)
    skill5 = models.PositiveIntegerField(default=0)
    skill6 = models.PositiveIntegerField(default=0)
    skill7 = models.PositiveIntegerField(default=0)
    skill8 = models.PositiveIntegerField(default=0)
    skill9 = models.PositiveIntegerField(default=0)
    knowledge0 = models.PositiveIntegerField(default=0)
    knowledge1 = models.PositiveIntegerField(default=0)
    knowledge2 = models.PositiveIntegerField(default=0)
    knowledge3 = models.PositiveIntegerField(default=0)
    knowledge4 = models.PositiveIntegerField(default=0)
    knowledge5 = models.PositiveIntegerField(default=0)
    knowledge6 = models.PositiveIntegerField(default=0)
    knowledge7 = models.PositiveIntegerField(default=0)
    knowledge8 = models.PositiveIntegerField(default=0)
    knowledge9 = models.PositiveIntegerField(default=0)
    background0 = models.PositiveIntegerField(default=0)
    background1 = models.PositiveIntegerField(default=0)
    background2 = models.PositiveIntegerField(default=0)
    background3 = models.PositiveIntegerField(default=0)
    background4 = models.PositiveIntegerField(default=0)
    background5 = models.PositiveIntegerField(default=0)
    background6 = models.PositiveIntegerField(default=0)
    background7 = models.PositiveIntegerField(default=0)
    background8 = models.PositiveIntegerField(default=0)
    background9 = models.PositiveIntegerField(default=0)
    trait0 = models.CharField(max_length=64, blank=True, default='')
    trait1 = models.CharField(max_length=64, blank=True, default='')
    trait2 = models.CharField(max_length=64, blank=True, default='')
    trait3 = models.CharField(max_length=64, blank=True, default='')
    trait4 = models.CharField(max_length=64, blank=True, default='')
    trait5 = models.CharField(max_length=64, blank=True, default='')
    trait6 = models.CharField(max_length=64, blank=True, default='')
    trait7 = models.CharField(max_length=64, blank=True, default='')
    trait8 = models.CharField(max_length=64, blank=True, default='')
    trait9 = models.CharField(max_length=64, blank=True, default='')
    trait10 = models.CharField(max_length=64, blank=True, default='')
    trait11 = models.CharField(max_length=64, blank=True, default='')
    trait12 = models.CharField(max_length=64, blank=True, default='')
    trait13 = models.CharField(max_length=64, blank=True, default='')
    trait14 = models.CharField(max_length=64, blank=True, default='')
    trait15 = models.CharField(max_length=64, blank=True, default='')
    merit0 = models.CharField(max_length=64, blank=True, default='')
    merit1 = models.CharField(max_length=64, blank=True, default='')
    merit2 = models.CharField(max_length=64, blank=True, default='')
    merit3 = models.CharField(max_length=64, blank=True, default='')
    merit4 = models.CharField(max_length=64, blank=True, default='')
    flaw0 = models.CharField(max_length=64, blank=True, default='')
    flaw1 = models.CharField(max_length=64, blank=True, default='')
    flaw2 = models.CharField(max_length=64, blank=True, default='')
    flaw3 = models.CharField(max_length=64, blank=True, default='')
    flaw4 = models.CharField(max_length=64, blank=True, default='')
    rite0 = models.CharField(max_length=64, blank=True, default='')
    rite1 = models.CharField(max_length=64, blank=True, default='')
    rite2 = models.CharField(max_length=64, blank=True, default='')
    rite3 = models.CharField(max_length=64, blank=True, default='')
    rite4 = models.CharField(max_length=64, blank=True, default='')
    rite5 = models.CharField(max_length=64, blank=True, default='')
    rite6 = models.CharField(max_length=64, blank=True, default='')
    rite7 = models.CharField(max_length=64, blank=True, default='')
    rite8 = models.CharField(max_length=64, blank=True, default='')
    rite9 = models.CharField(max_length=64, blank=True, default='')

    @property
    def creature_is(self,creature):
        return self.creature == creature

    @property
    def is_ghoul(self):
        return self.creature_is('ghoul')

    @property
    def is_kindred(self):
        return self.creature_is('kindred')

    @property
    def is_mage(self):
        return self.creature_is('mage')

    @property
    def is_garou(self):
        return self.creature_is('garou')

    @property
    def is_kinfolk(self):
        return self.creature_is('kinfolk')

    @property
    def is_changeling(self):
        return self.creature_is('changeling')

    @property
    def is_mortal(self):
        return self.creature_is('mortal')

    @property
    def is_undefined(self):
        return self.creature_is('undefined')

    @property
    def shapeshifter(self):
        glabro = {'strength': +2, 'dexterity': 0, 'stamina': +2,
                  'charisma': 0, 'manipulation': -1, 'appearance': -1,
                  'perception': 0, 'intelligence': 0, 'wits': 0}
        crinos = {'strength': +4, 'dexterity': +1, 'stamina': +3,
                  'charisma': 0, 'manipulation': -3, 'appearance': -10,
                  'perception': 0, 'intelligence': 0, 'wits': 0}
        hispo = {'strength': +3, 'dexterity': +2, 'stamina': +3,
                 'charisma': 0, 'manipulation': -3, 'appearance': 0,
                 'perception': 0, 'intelligence': 0, 'wits': 0}
        lupus = {'strength': +1, 'dexterity': +2, 'stamina': +2,
                 'charisma': 0, 'manipulation': -3, 'appearance': 0,
                 'perception': 0, 'intelligence': 0, 'wits': 0}
        return glabro, crinos, hispo, lupus

    def root_family(self):
        if self.creature == 'kindred':
            return self.family.replace(' Antitribu', '')
        else:
            return self.family

    def value_of(self, stat):
        found = find_stat_property(self.creature, stat)
        logger.info(f'Searching value of {stat} for {self.creature} ({self.name})')
        if found == 'n/a':
            logger.error(f'Error finding {stat} for {self.creature} ({self.name})')
            return -1
        return getattr(self, found)

    def get_specialities(self):
        base = STATS_NAMES[self.creature]
        to_be_checked = ['attributes', 'talents', 'skills', 'knowledges']
        specialities = []
        for category in to_be_checked:
            list = base[category]
            for stat in list:
                if self.value_of(stat) > 3:
                    specialities.append(f'{stat.title()} {self.value_of(stat)}')
        return specialities

    def get_shortcuts(self):
        shortcuts = []
        base = GM_SHORTCUTS[self.creature]
        for s in base:
            print(s)
            sc = f'{s[0].title()}+{s[1].title()}={self.value_of(s[0])+self.value_of(s[1])}'
            shortcuts.append(sc)
        return shortcuts



    @property
    def entrance(self):
        from collector.templatetags.wod_filters import as_generation, as_rank, as_breed, as_auspice, as_tribe_plural
        entrance = ''
        if self.creature == 'kindred':
            entrance = f'{as_generation(self.background3)} generation {self.family} of the {self.faction} ({self.group}).'
        elif self.creature == 'garou':
            entrance = f'{as_rank(self.rank)} {as_breed(self.breed)} {as_auspice(self.auspice)} of the  {as_tribe_plural(self.family)} ({self.group}).'
        return entrance

    def __str__(self):
        return "%s (%s %s of %s)" % (self.name, self.family, self.creature, self.faction)

    @property
    def freebies_per_age_threshold(self):
        aging = {'0': 15, '50': 30, '100': 60, '150': 90, '200': 120, '250': 150, '300': 190, '400': 240,
                           '500': 280, '700': 320, '900': 360, '1100': 400, '1300': 425, '1500': 495, '1700': 565,
                           '2000': 645, '2500': 735, '3000': 825}
        time_awake = int(self.trueage) - int(self.timeintorpor)
        x = 0
        for key, val in aging.items():
            if int(key) <= time_awake:
                x = val
        return x

    def fix_changeling(self):
        if self.willpower < 4:
            self.willpower = 4
        if self.glamour < 4:
            self.glamour = 4
        if self.banality < 3:
            self.banality = 3

    def fix_wraith(self):
        pass

    def fix_kindred(self):
        logger.info(f'Fixing kindred')
        # Embrace and Age
        condi = self.condition.split('-')
        if condi.count == 2:
            if condi[0] == 'DEAD':
                self.finaldeath == int(condi[1])
        self.embrace = int(self.embrace)
        self.age = int(self.age)
        self.trueage = int(self.trueage)
        if self.embrace == 0:
            self.embrace = chronicle.era - (self.trueage - self.age)
        if self.trueage == 0:
            self.trueage = chronicle.era - (self.embrace - self.age)
        self.expectedfreebies = self.freebies_per_age_threshold
        # Willpower
        if self.willpower < self.virtue2:
            self.willpower = self.virtue2
        # Humanity
        if self.humanity < self.virtue0 + self.virtue1:
            self.humanity = self.virtue0 + self.virtue1
        # Bloodpool
        self.bloodpool = bloodpool[13 - self.value_of('generation')]

        self.display_gauge = self.value_of('generation')*2 + self.value_of('status')*2
        self.display_pole = self.groupspec


    def fix_ghoul(self):
        self.display_gauge = 3
        if self.sire:
            if self.family == '':
                domitor = Creature.objects.get(name=self.sire)
                self.family = domitor.family
                self.faction = domitor.faction
                if domitor:
                    self.display_gauge = domitor.display_gauge / 3
        self.expectedfreebies = self.freebies_per_immortal_age
        self.bloodpool = 10
        self.display_pole = self.groupspec


    def fix_mortal(self):
        self.trueage = self.age
        # self.power2 = 5 + self.attribute2 + self.attribute3
        if self.willpower < 2:
            self.willpower = 2
        self.expectedfreebies = self.freebies_per_mortal_age
        self.display_gauge = 1
        self.display_pole = self.groupspec

    def fix_kinfolk(self):
        self.trueage = self.age
        self.expectedfreebies = self.freebies_per_mortal_age
        self.display_pole = self.groupspec
        self.display_gauge = self.value_of('renown') + self.value_of('status') + self.value_of('pure-breed')

    def fix_fomori(self):
        # self.display_gauge = self.power2
        self.expectedfreebies = self.freebies_per_mortal_age
        self.display_gauge = 1

    def fix_bane(self):
        self.display_gauge = self.power2 * 2
        self.display_pole = self.groupspec

    def fix_mage(self):
        self.expectedfreebies = self.freebies_per_mortal_age
        self.display_gauge = self.arete*2

    def fix_garou(self):
        self.trueage = self.age
        

        # Tribe
        if self.family in ["Bone Gnawer", "Children of Gaia", "Stargazer", "Wendigo"]:
            if self.willpower < 4:
                self.willpower = 4
        else:
            if self.willpower < 3:
                self.willpower = 3
        # Auspice
        if self.auspice == 0:
            # Initial Renown
            if self.glory + self.honor + self.wisdom < 3:
                self.glory = 1
                self.honor = 1
                self.wisdom = 1
            # Rank
            if self.glory + self.honor + self.wisdom >= 25:
                self.rank = 5
            elif self.glory + self.honor + self.wisdom >= 19:
                self.rank = 4
            elif self.glory + self.honor + self.wisdom >= 13:
                self.rank = 3
            elif self.glory + self.honor + self.wisdom >= 7:
                self.rank = 2
            elif self.glory + self.honor + self.wisdom >= 3:
                self.rank = 1
            # Initial Rage
            if self.rage < 1:
                self.rage = 1
        elif self.auspice == 1:  # Theurge
            # Initial Renown
            if self.wisdom < 3:
                self.wisdem = 3
            # Rank
            if self.glory >= 4 and self.honor >= 9 and self.wisdom >= 10:
                self.rank = 5
            elif self.glory >= 4 and self.honor >= 2 and self.wisdom >= 9:
                self.rank = 4
            elif self.glory >= 2 and self.honor >= 1 and self.wisdom >= 7:
                self.rank = 3
            elif self.glory >= 1 and self.honor >= 0 and self.wisdom >= 5:
                self.rank = 2
            elif self.glory >= 0 and self.honor >= 0 and self.wisdom >= 3:
                self.rank = 1
            # Initial Rage
            if self.rage < 2:
                self.rage = 2
        elif self.auspice == 2:  # Philodox
            # Initial Renown
            if self.honor < 3:
                self.honor = 3
            # Initial Rage
            if self.rage < 3:
                self.rage = 3
            # Rank
            if self.glory >= 4 and self.honor >= 10 and self.wisdom >= 9:
                self.rank = 5
            elif self.glory >= 3 and self.honor >= 8 and self.wisdom >= 4:
                self.rank = 4
            elif self.glory >= 2 and self.honor >= 6 and self.wisdom >= 2:
                self.rank = 3
            elif self.glory >= 1 and self.honor >= 4 and self.wisdom >= 1:
                self.rank = 2
            elif self.glory >= 0 and self.honor >= 3 and self.wisdom >= 0:
                self.rank = 1
        elif self.auspice == 3:  # Galliard
            # Initial Renown
            if self.glory < 2:
                self.glory = 2
            if self.wisdom < 1:
                self.wisdom = 1
            # Initial Rage
            if self.rage < 4:
                self.rage = 4
            # Rank
            if self.glory >= 9 and self.honor >= 5 and self.wisdom >= 9:
                self.rank = 5
            elif self.glory >= 7 and self.honor >= 2 and self.wisdom >= 6:
                self.rank = 4
            elif self.glory >= 4 and self.honor >= 2 and self.wisdom >= 4:
                self.rank = 3
            elif self.glory >= 4 and self.honor >= 2 and self.wisdom >= 2:
                self.rank = 2
            elif self.glory >= 2 and self.honor >= 0 and self.wisdom >= 1:
                self.rank = 1
        elif self.auspice == 4:  # Ahroun
            # Initial Renown
            if self.glory < 2:
                self.glory = 2
            if self.honor < 1:
                self.honor = 1
            # Initial Rage
            if self.rage < 5:
                self.rage = 5
            # Rank
            if self.glory >= 10 and self.honor >= 9 and self.wisdom >= 4:
                self.rank = 5
            elif self.glory >= 9 and self.honor >= 5 and self.wisdom >= 2:
                self.rank = 4
            elif self.glory >= 6 and self.honor >= 3 and self.wisdom >= 1:
                self.rank = 3
            elif self.glory >= 4 and self.honor >= 1 and self.wisdom >= 1:
                self.rank = 2
            elif self.glory >= 2 and self.honor >= 1 and self.wisdom >= 0:
                self.rank = 1
        # Breed
        if self.breed == 0:  # Homid
            if self.gnosis < 1:
                self.gnosis = 1
        elif self.breed == 1:  # Metis
            if self.gnosis < 3:
                self.gnosis = 3
        elif self.breed == 2:  # Lupus
            if self.gnosis < 5:
                self.gnosis = 5
        self.display_gauge = self.glory + self.honor + self.wisdom
        if self.breed == 1:
            self.display_gauge -= 1
        self.display_pole = self.groupspec
        expected_freebies_by_rank = [0, 55, 134, 234, 345]
        self.expectedfreebies = self.freebies_per_mortal_age + expected_freebies_by_rank[self.rank - 1]

    @property
    def freebies_per_mortal_age(self):
        return (int((self.age - 25) / 10) + 1) * 10

    @property
    def freebies_per_immortal_age(self):
        return int(((self.trueage - 10) / 5))

    def update_rid(self):
        self.rid = toRID(self.name)

    def fix(self):
        logger.info(f'Fixing ............ [{self.name}]')
        # at:3/3/3 ab:7/5/3 b:3 w:2 f:15
        self.freebies = -((3 + 3 + 3 + 9) * 5 + (7 + 5 + 3) * 2 + 3 + 2 + 15)
        if 'changeling' == self.creature:
            # traits:3 realms:5 backgrounds:5 willpower:4 glamour:4, banality:3 freebies:15
            self.freebies = -((7 + 5 + 3 + 9) * 5 + (13 + 9 + 5) * 2)
            self.freebies = -(3*5 + 5*2 + 5*1 + 4 + 4*3 - 3 + 15)
            self.fix_changeling()
        if 'kindred' == self.creature:
            # at:7/5/3 ab:13/9/5 b:5 d:21 v:7 wh:10 f:15
            self.freebies = -((7 + 5 + 3 + 9) * 5 + (13 + 9 + 5) * 2 + 7 * 3 + (7 + 3) * 2 + 10 + 15)
            self.fix_kindred()
        elif 'garou' == self.creature:
            # at:7/5/3 ab:13/9/5 b:5 g:21 rgw:16 f:15
            self.freebies = -((7 + 5 + 3 + 9) * 5 + (13 + 9 + 5) * 2 + 5 + 7 * 3 + 16 + 15)
            self.fix_garou()
        elif 'mage' == self.creature:
            # at:7/5/3 ab:13/9/5 b:5 g:21 rgw:16 f:15
            self.freebies = -((7 + 5 + 3 + 9) * 5 + (13 + 9 + 5) * 2 + 5 + 7 * 3 + 16 + 15)
            self.fix_mage()
        elif 'ghoul' == self.creature:
            self.fix_ghoul()
        elif 'kinfolk' == self.creature:
            # at:6/4/3 ab:11/7/4 b:5 w:3 f:21
            self.freebies = -((6 + 4 + 3 + 9) * 5 + (11 + 7 + 4) * 2 + 5 + 3 + 21)
            self.fix_kinfolk()
        elif 'fomori' == self.creature:
            self.freebies = -((6 + 4 + 3 + 9) * 5 + (11 + 7 + 4) * 2 + 5 + 3 + 21)
            self.fix_fomori()
        elif self.creature == 'wraith':
            self.freebies = -((7 + 5 + 3 + 9) * 5 + (13 + 9 + 5) * 2 + 5*5 + 7 + 10 + 10 + 5*2)
            self.fix_wraith()
        else:
            # self.creature = 'mortal'
            self.fix_mortal()

        self.expectedfreebies += self.extra
        self.summary = f'Freebies: {self.freebies}'
        self.calculate_freebies()
        self.changeName()
        self.need_fix = False

    def changeName(self):
        if self.new_name:
            all = Creature.objects.filter(sire=self.rid)
            new_rid = toRID(self.new_name)
            self.name = self.new_name
            self.rid = new_rid
            self.new_name = ''
            for x in all:
                x.sire = new_rid
                x.need_fix = True
                x.save()



    def val_as_dots(self, val):
        res = ''
        for x in range(5):
            if x < val:
                res += '●'
            else:
                res += '○'
        return res

    def get_roster(self):
        lines = []
        # lines.append(f'<strong>{self.name}</strong>')
        # if (self.entrance):
        #     lines.append(f'<i>{self.entrance}</i>')
        # lines.append(f'Concept: {self.concept}')
        # if self.creature == 'kindred' or self.creature == 'ghoul':
        #     lines.append(f'Age: {self.age}')
        #     lines.append(f'Real Age: {self.trueage}')
        #     lines.append(f'Embrace: {self.embrace}')
        # else:
        #     lines.append(f'Age: {self.age}')
        # lines.append(f'Nature: {self.nature}')
        # lines.append(f'Demeanor: {self.demeanor}')
        # lines.append(
        #     f'<b>Attributes</b> <small>({self.total_physical}/{self.total_social}/{self.total_mental})</small>:')
        # lines.append(f'Strength {self.attribute0}, Dexterity {self.attribute1}, Stamina {self.attribute2}')
        # lines.append(f'Charisma {self.attribute3}, Manipulation {self.attribute4}, Appearance {self.attribute5}')
        # lines.append(f'Perception {self.attribute6}, Intelligence {self.attribute7}, Wits {self.attribute8}')
        # abilities_list = []
        # topics = ['talents', 'skills', 'knowledges']
        # for topic in topics:
        #     for ability in STATS_NAMES[self.creature][topic]:
        #         val = self.value_of(ability)
        #         if val > 0:
        #             abilities_list.append(f'{ability.title()} {val}')
        # lines.append(
        #     f'<b>Abilities</b> <small>({self.total_talents}/{self.total_skills}/{self.total_knowledges})</small>: {", ".join(abilities_list)}.')
        # backgrounds_list = []
        # topics = ['backgrounds']
        # for topic in topics:
        #     for ability in STATS_NAMES[self.creature][topic]:
        #         val = self.value_of(ability)
        #         if val > 0:
        #             abilities_list.append(f'{ability.title()} {val}')
        # if len(backgrounds_list) > 0:
        #     lines.append(
        #         f'<b>Backgrounds</b> <small>({self.total_backgrounds})</small>: {", ".join(backgrounds_list)}.')
        # gifts_list = []
        # for n in range(10):
        #     if getattr(self, f"gift{n}"):
        #         gifts_list.append(f'{getattr(self, f"gift{n}")}')
        # if len(gifts_list) > 0:
        #     if self.creature == 'kindred' or self.creature == 'ghoul':
        #         lines.append(f'<b>Disciplines</b>: {", ".join(gifts_list)}.')
        #     else:
        #         lines.append(f'<b>Gifts</b>: {", ".join(gifts_list)}.')
        # merits_list = []
        # for n in range(4):
        #     if getattr(self, f"merit{n}"):
        #         merits_list.append(f'{getattr(self, f"merit{n}")}')
        # if len(merits_list) > 0:
        #     lines.append(f'<b>Merits:</b> {", ".join(merits_list)}.')
        # flaws_list = []
        # for n in range(4):
        #     if getattr(self, f"flaw{n}"):
        #         flaws_list.append(f'{getattr(self, f"flaw{n}")}')
        # if len(flaws_list) > 0:
        #     lines.append(f'<b>Flaw:</b> {", ".join(flaws_list)}.')
        # powers_line = ''
        # if self.creature == 'kindred' or self.creature == 'ghoul':
        #     lines.append(
        #         f'<b>Virtues</b>: Conscience {self.level0}, Self-Control {self.level1}, Courage {self.level2}.')
        #     powers_line += f'<b>Blood Pool</b> {self.bloodpool} '
        #     powers_line += f'<b>{self.path}</b> {self.humanity}'
        # elif self.creature == 'garou' or self.creature == 'kinfolk':
        #     powers_line += f'<b>Rage</b> {self.rage} '
        #     powers_line += f'<b>Gnosis</b> {self.gnosis}'
        # elif self.creature == 'mage' :
        #     powers_line += f'<b>Arete</b> {self.arete} '
        #     powers_line += f'<b>Quintessence</b> {self.quintessence}'
        #     powers_line += f'<b>Paradox</b> {self.quintessence}'
        #
        # else:
        #     powers_line += f'<b>Blood Pool</b> {self.bloodpool}'
        # powers_line += f' <b>Willpower</b> {self.willpower}'
        # lines.append(powers_line)
        # lines.append(" ")
        # lines.append(" ")
        return "<BR/>".join(lines)

    def extract_roster(self):
        return self.get_roster()

    def randomize_attributes(self):
        # Initialize
        for t in range(10):
            setattr(self, f'attribute{t}', 1)
        # Grab relevant values per creature
        attributes_points = STATS_TEMPLATES[self.creature]['attributes'].split('/')
        attributes = []
        for x in range(3):
            attributes.append(int(attributes_points[x]))
        random.shuffle(attributes)
        for t in range(3):
            while attributes[t] > 0:
                attributes[t] -= 1
                a = random.randrange(0, 3)+t*3
                stat = f'attribute{a}'
                v = getattr(self, stat)
                setattr(self, stat, v + 1)

    def randomize_abilities(self):
        # Initialize
        for t in range(10):
            setattr(self, f'talent{t}', 0)
            setattr(self, f'skill{t}', 0)
            setattr(self, f'knowledge{t}', 0)
        # Grab relevant values per creature
        abilities_points = STATS_TEMPLATES[self.creature]['abilities'].split('/')
        abilities = []
        for x in range(3):
            abilities.append(int(abilities_points[x]))
        random.shuffle(abilities)
        abilities_titles = ['talent', 'skill', 'knowledge']
        for t in range(3):
            while abilities[t] > 0:
                a = random.randrange(0, 10)
                stat = f'{abilities_titles[t]}{a}'
                v = getattr(self, stat)
                if v < 3:
                    abilities[t] -= 1
                    setattr(self, stat, v + 1)

    def randomize_backgrounds(self):
        # Initialize
        for i in range(10):
            setattr(self, f'background{i}', 0)
        # Grab relevant values per creature
        backgrounds = int(STATS_TEMPLATES[self.creature]['backgrounds'])
        while backgrounds > 0:
            idx = random.randrange(0, 10)
            stat = f'background{idx}'
            value = getattr(self, stat)
            if value < 3:
                backgrounds -= 1
                setattr(self, stat, value + 1)

    def randomize_archetypes(self):
        if not self.nature:
            self.nature = random.choice(ARCHETYPES)
        if not self.demeanor:
            self.demeanor = random.choice(ARCHETYPES)

    def randomize_all(self):
        self.randomize_attributes()
        self.randomize_abilities()
        self.randomize_archetypes()
        self.randomize_backgrounds()
        if self.creature == 'kindred':
            if self.family:
                for i in range(16):
                    setattr(self, f'trait{i}', '')
                x = 0
                for d in CLANS_SPECIFICS[self.family]['disciplines']:
                    setattr(self, f'trait{x}', d)
                    x+=1
                    print(d)
            virtues = 7
            self.virtue0 = 1
            self.virtue1 = 1
            self.virtue2 = 1
            while virtues > 0:
                a = random.randrange(0, 3)
                v = getattr(self, f'virtue{a}')
                if v < 5:
                    setattr(self, f'virtue{a}', v+1)
                    virtues -= 1
            self.weakness = CLANS_SPECIFICS[self.family]['clan_weakness']


    # def extract_raw(self):
    #     # filename = f'./raw/{self.rid}.txt'
    #     lines = []
    #     lines.append(f'{self.name}\n')
    #     lines.append(f'Nature\t\t{self.nature}\tDemeanor\t{self.demeanor}\n')
    #     lines.append(f'Concept\t\t{self.concept}\tAge\t{self.age}\n')
    #     lines.append(
    #         f'Physical\t({self.total_physical})\tSocial\t({self.total_social})\tMental\t({self.total_mental})\n')
    #     lines.append(
    #         f'Strength\t{self.val_as_dots(self.attribute0)}\tCharisma\t{self.val_as_dots(self.attribute3)}\tPerception\t{self.val_as_dots(self.attribute6)}\n')
    #     lines.append(
    #         f'Dexterity\t{self.val_as_dots(self.attribute1)}\tManipulation\t{self.val_as_dots(self.attribute4)}\tIntelligence\t{self.val_as_dots(self.attribute7)}\n')
    #     lines.append(
    #         f'Stamina\t{self.val_as_dots(self.attribute2)}\tAppearance\t{self.val_as_dots(self.attribute5)}\tWits\t{self.val_as_dots(self.attribute8)}\n')
    #     lines.append(
    #         f'Talents\t({self.total_talents})\tSkills\t({self.total_skills})\tKnowledges\t({self.total_knowledges})\t\n')
    #     for n in range(10):
    #         lines.append(
    #             f'{STATS_NAMES[self.creature]["talents"][n]}\t{self.val_as_dots(getattr(self, f"talent{n}"))}\t{STATS_NAMES[self.creature]["skills"][n]}\t{self.val_as_dots(getattr(self, f"skill{n}"))}\t{STATS_NAMES[self.creature]["knowledges"][n]}\t{self.val_as_dots(getattr(self, f"knowledge{n}"))}\n')
    #     blines = []
    #     for n in range(10):
    #         if getattr(self, f"background{n}") > 0:
    #             blines.append(f'{STATS_NAMES[self.creature]["backgrounds"][n]} ({getattr(self, f"background{n}")})')
    #     lines.append(f'Backgrounds: {", ".join(blines)}.\n')
    #     glines = []
    #     for n in range(20):
    #         if getattr(self, f"gift{n}"):
    #             glines.append(f'{getattr(self, f"gift{n}")}')
    #     lines.append(f'Gifts: {", ".join(glines)}.\n')
    #     return "".join(lines)

    def calculate_freebies(self):
        # Attributes
        self.total_physical = -3
        self.total_social = -3
        self.total_mental = -3
        for n in range(3):
            p = getattr(self, 'attribute%d' % (n))
            s = getattr(self, 'attribute%d' % (n + 3))
            m = getattr(self, 'attribute%d' % (n + 6))
            self.freebies += (p + s + m) * 5
            self.total_physical += p
            self.total_social += s
            self.total_mental += m
        # Abilities
        self.total_talents = 0
        self.total_skills = 0
        self.total_knowledges = 0
        for n in range(10):
            t = getattr(self, 'talent%d' % (n))
            s = getattr(self, 'skill%d' % (n))
            k = getattr(self, 'knowledge%d' % (n))
            self.freebies += (t + s + k) * 2
            self.total_talents += t
            self.total_skills += s
            self.total_knowledges += k
        # Backgrounds
        self.total_backgrounds = 0
        for n in range(10):
            b = getattr(self, 'background%d' % (n))
            self.freebies += b * 1
            self.total_backgrounds += b
        # Merits & Flaws
        for n in range(4):
            merit = getattr(self, 'merit%d' % (n))
            if merit != '':
                self.freebies += int(merit.split('(')[1].replace('(', '').replace(')', ''))
            flaw = getattr(self, 'flaw%d' % (n))
            if flaw != '':
                self.freebies -= int(flaw.split('(')[1].replace('(', '').replace(')', ''))
        # Traits
        self.total_traits = 0
        for i in range(16):
            trait = getattr(self, f'trait{i}')
            print(trait)
            if trait:
                self.total_traits += int(trait.split('(')[1].replace('(', '').replace(')', ''))
        # Sort traits
        traits = []
        for i in range(10):
            traits.append(getattr(self, f'trait{i}'))
        traits = filter(None, traits)
        i = 0
        for trait in traits:
            setattr(self, f'trait{i}', trait)
            i += 1


        # Specific
        if 'changeling' == self.creature:
            self.freebies += getattr(self, 'glamour') * 3
            self.freebies += getattr(self, 'willpower') * 1
            self.freebies += self.total_traits * 5  # 5 pts per art pts
            self.freebies += self.total_realms * 2   # 2 pts per realm pts
        elif 'garou' == self.creature:
            self.freebies += getattr(self, 'rage')
            self.freebies += getattr(self, 'gnosis') * 2
            self.freebies += getattr(self, 'willpower')
            self.freebies += self.total_traits * 7   # 7 pts per gift level
        elif 'kindred' == self.creature:
            # Virtues
            for i in range(3):
                self.freebies += getattr(self, f'virtue{i}') * 2
            self.freebies += getattr(self, 'humanity')
            self.freebies += getattr(self, 'willpower')
            self.freebies += self.total_traits * 7   # 7 pts per discipline pts
        elif 'mage' == self.creature:
            self.freebies += getattr(self, 'arete')
            self.freebies += getattr(self, 'quintessence')
            self.freebies += getattr(self, 'willpower')
            self.freebies += self.total_traits * 7  # 7 pts per discipline pts
        elif 'wraith' == self.creature:
            self.freebies += getattr(self, 'pathos')
            self.freebies += getattr(self, 'corpus')
            self.freebies += getattr(self, 'willpower') * 2
            self.freebies += self.total_traits * 5  # 5 pts per arcanos pts
            self.freebies += self.total_passions * 2  # 2 pts per passion pts
            self.freebies += self.total_fetters   # 1 pts per passion pts
        else:
            self.freebies += getattr(self, 'willpower')
        self.freebiesdif = self.expectedfreebies - self.freebies
        if self.freebiesdif == 0:
            self.status = 'OK'
        elif self.freebiesdif < 0:
            self.status = 'UNBALANCED'
        else:
            self.status = 'OK+'

    @property
    def sire_name(self):
        sires = Creature.objects.filter(rid=self.sire)
        if len(sires) == 1:
            return sires.first().name
        return ''


    @property
    def toDict(self):
        d = {
            'name': self.name,
            'player': self.player,
            'creature': self.creature,
            'family': self.family,
            'faction': self.faction,
            'group': self.group,
            'groupspec': self.groupspec,
            'display_gauge': self.display_gauge,
            'display_pole': self.display_pole,
            'freebies': self.freebies,
            'auspice': self.auspice,
            'breed': self.breed,
            'rank': self.rank,
            'condition': self.condition,
            'rid': self.rid,
            'position':self.position,
            'status': self.status,
            'generation': self.generation,
            'ghouls': ",".join(self.retainers)
        }
        return d

    def json_str(self):
        sire = ''
        if self.domitor:
            sire = self.domitor
        else:
            sire = self.sire
        d = {
            'name': self.name,
            'clan': self.family,
            'family': self.root_family(),
            'condition': self.condition,
            'status': self.status,
            'sire': sire,
            'generation': (13 - self.background3),
            'ghost': self.ghost,
            'faction': self.faction,
            'rid': self.rid,
            'id': 0,
            'key': self.id,
            'trueage': self.trueage,
            'children': [],
            'ghouls': ",".join(self.retainers)
        }
        return d

    def find_lineage(self, lockup=False):
        """ Find the full lineage for this character
        """
        lineage = self.toJSON()
        lineage['children'] = []
        lineage['generation'] = 13 - self.background3
        infans = Creature.objects.filter(creature='kindred', sire=self.name)
        if infans:
            for childer in infans:
                if childer.ghost or childer.mythic:
                    lineage['children'].append(childer.find_lineage(True))
                else:
                    if childer.chronicle == chronicle.acronym:
                        lineage['children'].append(childer.find_lineage(True))
        return lineage

    @property
    def retainers(self):
        list = []
        if self.creature == 'kindred':
            ghouls = Creature.objects.filter(sire=self.rid, creature='ghoul')
            cnt = self.value_of('retainers')
            for g in ghouls:
                list.append(g.name)
            if len(ghouls) < cnt:
                for x in range(cnt - len(ghouls)):
                    list.append(f'Unknown {x}')
        return list

    @property
    def generation(self):
        if self.creature == 'kindred':
            return 13 - self.value_of('generation')
        else:
            return 0

    def toJSON(self):
        self.guideline = self.stats_template
        jstr = json.dumps(self, default=json_default, sort_keys=True, indent=4)
        return jstr

    @property
    def stats_template(self):

        list = []
        for v in STATS_TEMPLATES[self.creature]:
            list.append(f'{v.title()}:{STATS_TEMPLATES[self.creature][v]}')
        return '[' + ' '.join(list) + ']'


def refix(modeladmin, request, queryset):
    for creature in queryset:
        creature.need_fix = True
        creature.save()
    short_description = 'Fix creature'


def push_to_RAM(modeladmin, request, queryset):
    for creature in queryset:
        creature.chronicle = 'RAM'
        creature.need_fix = True
        creature.save()
    short_description = 'Push to Rage Across Munich'


def set_female(modeladmin, request, queryset):
    for creature in queryset:
        creature.sex = False
        creature.need_fix = True
        creature.save()
    short_description = 'Make female'


def set_male(modeladmin, request, queryset):
    for creature in queryset:
        creature.sex = True
        creature.need_fix = True
        creature.save()
    short_description = 'Make male'


def push_to_newyork(modeladmin, request, queryset):
    for creature in queryset:
        creature.chronicle = 'NYC'
        creature.need_fix = True
        creature.save()
    short_description = 'Push to New York City'


def push_to_munich(modeladmin, request, queryset):
    for creature in queryset:
        creature.chronicle = 'BAV'
        creature.need_fix = True
        creature.save()
    short_description = 'Push to Munich'


def push_to_world(modeladmin, request, queryset):
    for creature in queryset:
        creature.chronicle = 'NYC'
        creature.need_fix = True
        creature.save()
    short_description = 'Push to the world'


def randomize_attributes(modeladmin, request, queryset):
    for creature in queryset:
        creature.randomize_attributes()
        creature.need_fix = True
        creature.save()
    short_description = 'Randomize Attributes'


def randomize_abilities(modeladmin, request, queryset):
    for creature in queryset:
        creature.randomize_abilities()
        creature.need_fix = True
        creature.save()
    short_description = 'Randomize Abilities'


def randomize_backgrounds(modeladmin, request, queryset):
    for creature in queryset:
        creature.randomize_backgrounds()
        creature.need_fix = True
        creature.save()
    short_description = 'Randomize Backgrounds'


def randomize_archetypes(modeladmin, request, queryset):
    for creature in queryset:
        creature.randomize_archetypes()
        creature.need_fix = True
        creature.save()
    short_description = 'Randomize Backgrounds'

def randomize_all(modeladmin, request, queryset):
    for creature in queryset:
        creature.randomize_all()
        creature.need_fix = True
        creature.save()
    short_description = 'Randomize All'



class CreatureAdmin(admin.ModelAdmin):
    list_display = [  # 'domitor',
        'name', 'rid', 'sire', 'player','retainers', 'total_backgrounds', 'total_physical', 'total_social', 'total_mental', 'total_talents', 'total_skills', 'total_knowledges', 'family', 'display_gauge', 'display_pole', 'freebies', 'concept', 'groupspec',
        'faction',
        'status', 'embrace', 'condition']
    ordering = ['name', 'group', 'creature']
    actions = [randomize_backgrounds, randomize_all, randomize_archetypes, randomize_attributes, randomize_abilities, refix, set_male, set_female, push_to_munich, push_to_newyork, push_to_world]
    list_filter = ['chronicle', 'is_new', 'primogen', 'group', 'sire', 'groupspec', 'faction', 'family', 'creature', 'mythic', 'ghost']
    search_fields = ['name']
