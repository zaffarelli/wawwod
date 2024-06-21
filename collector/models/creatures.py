from django.db import models
from django.contrib import admin
import json
import logging

from collector.templatetags.wod_filters import as_tribe_plural
from collector.utils.wod_reference import get_current_chronicle, find_stat_property, STATS_NAMES, GM_SHORTCUTS, \
    bloodpool, STATS_TEMPLATES, ARCHETYPES, CLANS_SPECIFICS, RAGE_PER_AUSPICE, GNOSIS_PER_BREED, PER_TRIBE
from collector.utils.helper import json_default, toRID
from collector.models.adventures import Adventure
import random

logger = logging.Logger(__name__)
chronicle = get_current_chronicle()


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
    chronicle = models.CharField(max_length=8, default='NYC')
    creature = models.CharField(max_length=20, default='kindred')
    sex = models.BooleanField(default=False)
    display_gauge = models.IntegerField(default=0)
    display_pole = models.CharField(max_length=64, default='', blank=True)
    residence = models.CharField(max_length=64, default='', blank=True)
    list_pos = models.IntegerField(default=0, blank=True)

    pre_change_access = models.BooleanField(blank=True, default=False)

    finaldeath = models.IntegerField(default=0)
    timeintorpor = models.PositiveIntegerField(default=0)
    picture = models.CharField(max_length=128, blank=True, default='')
    sire = models.CharField(max_length=64, blank=True, default='')
    patron = models.CharField(max_length=64, blank=True, default='')
    rank = models.CharField(max_length=32, blank=True, default='')
    topic = models.TextField(max_length=1024, blank=True, default='')
    status = models.CharField(max_length=32, blank=True, default='OK')
    cast_figure = models.CharField(max_length=128, blank=True, default='')
    position = models.CharField(max_length=64, blank=True, default='')
    maj = models.PositiveIntegerField(default=0)
    need_fix = models.BooleanField(default=False)
    is_new = models.BooleanField(default=True)
    freebiedif = models.IntegerField(default=0)
    freebies = models.IntegerField(default=0, blank=True)
    expectedfreebies = models.IntegerField(default=0)
    disciplinepoints = models.IntegerField(default=0)
    experience = models.IntegerField(default=0)
    exp_pool = models.IntegerField(default=0)
    exp_spent = models.IntegerField(default=0)
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

    district = models.CharField(max_length=8, blank=True, default='d01')

    # Player specific
    notes_on_backgrounds = models.TextField(max_length=2048, default='', blank=True)
    notes_on_meritsflaws = models.TextField(max_length=1024, default='', blank=True)
    notes_on_history = models.TextField(max_length=3072, default='', blank=True)
    notes_on_naturedemeanor = models.TextField(max_length=1024, default='', blank=True)
    notes_on_traits = models.TextField(max_length=2048, default='', blank=True)
    adventure = models.ForeignKey(Adventure, on_delete=models.SET_NULL, null=True, default=None, blank=True)

    # All
    willpower = models.PositiveIntegerField(default=1)
    equipment = models.TextField(max_length=2048, default='', blank=True)

    # CTD
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
    virtue_name0 = models.CharField(max_length=32, blank=True, default='')
    virtue_name1 = models.CharField(max_length=32, blank=True, default='')
    virtue_name2 = models.CharField(max_length=32, blank=True, default='')

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

    # WTO
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
    attribute0 = models.PositiveIntegerField(default=0)
    attribute1 = models.PositiveIntegerField(default=0)
    attribute2 = models.PositiveIntegerField(default=0)
    attribute3 = models.PositiveIntegerField(default=0)
    attribute4 = models.PositiveIntegerField(default=0)
    attribute5 = models.PositiveIntegerField(default=0)
    attribute6 = models.PositiveIntegerField(default=0)
    attribute7 = models.PositiveIntegerField(default=0)
    attribute8 = models.PositiveIntegerField(default=0)
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
    background10 = models.PositiveIntegerField(default=0)
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
    def creature_is(self, creature):
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

    def get_traits(self):
        list = []
        for x in range(16):
            trait = getattr(self, f'trait{x}', '')
            if trait != '':
                list.append(trait)
        return list

    def get_trait_value(self, label):
        code = ''
        value = -1
        trait = ''
        for x in range(16):
            trait = getattr(self, f'trait{x}', '')
            if trait.startswith(label.lower()):
                code = f'trait{x}'
                value = int(trait.split(" ")[1].replace(")", ""))
                print(trait, value, code)
        return value, code, trait

    def set_trait_value(self, label, val):
        code = ''
        value = ''
        cnt = -1
        for x in range(16):
            trait = getattr(self, f'trait{x}', '')
            if len(trait) > 0:
                cnt += 1
                if trait.startswith(label.lower()):
                    code = f'trait{x}'
                    value = trait.split(" ")[0] + f'({val})'
            print(trait, code, value)
        if code != '':
            setattr(self, code, value)
        else:
            setattr(self, f"trait{cnt + 1}", f"{label.title()} ({val})")
        return value, code

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
            sc = f'{s[0].title()}+{s[1].title()}={self.value_of(s[0]) + self.value_of(s[1])}'
            shortcuts.append(sc)
        return shortcuts

    @property
    def storyteller_entrance(self):
        from collector.templatetags.wod_filters import as_generation, as_rank, as_breed, as_auspice, as_tribe_plural
        entrance = ''
        if self.creature == 'kindred':
            entrance = f'{self.family} {as_generation(self.background3)} ({self.group}/{self.groupspec})'
        elif self.creature == 'garou':
            entrance = f'{as_rank(self.rank)} {as_breed(self.breed)} {as_auspice(self.auspice)} of the  {as_tribe_plural(self.family)} ({self.group})'
        elif self.creature == 'ghoul':
            entrance = f'Ghoul of {self.sire_name}'
        else:
            entrance = f'{self.concept} ({self.group})'
        return entrance

    @property
    def entrance(self):
        from collector.templatetags.wod_filters import as_generation, as_rank, as_breed, as_auspice, as_tribe_plural
        entrance = ''
        if self.creature == 'kindred':
            g = ""
            if self.group:
                g = f' ({self.group})'
            entrance = f'{as_generation(self.background3)} generation {self.family} of the {self.faction}{g}.'
        elif self.creature == 'garou':
            entrance = f'{as_rank(self.rank)} {as_breed(self.breed)} {as_auspice(self.auspice)} of the  {as_tribe_plural(self.family)} ({self.group}).'
        elif self.creature == 'ghoul':
            entrance = f'Ghoul of {self.sire_name}'
        else:
            entrance = f'{self.concept} ({self.group}).'

        return entrance

    def __str__(self):
        from collector.utils.wod_reference import BREEDS, AUSPICES
        if self.creature == "garou":
            return f"{self.name} ({BREEDS[self.breed]} {AUSPICES[self.auspice]} of {as_tribe_plural(self.family)})"
        else:
            return f"{self.name} ({self.creature})"

    @property
    def freebies_per_age_threshold(self):
        aging = {
            '0': 15,  # Neonate
            '10': 25,
            '20': 35,
            '30': 45,
            '40': 55,
            '50': 65,
            '60': 75,
            '75': 100,  # Ancilla
            '100': 120,
            '125': 140,
            '150': 160,
            '175': 180,
            '200': 200,  # Elder
            '250': 220,
            '300': 240,
            '350': 260,
            '400': 280,
            '450': 300,
            '500': 330,
            '550': 360,
            '600': 390,
            '650': 430,
            '700': 470,
            '800': 520,
            '900': 550,
            '1000': 600,
            '1500': 700,
            '2000': 800,
            '2500': 900,
            '3000': 1000
        }
        time_awake = int(self.trueage) - int(self.age) - int(self.timeintorpor)
        logger.info(f'{self.name} time awake --> {time_awake}')
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
        logger.info(f'Fixing kindred {self.name}')
        # Embrace and Age
        condi = self.condition.split('=')
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
        if self.player:
            from collector.models.chronicles import Chronicle
            self.expectedfreebies = Chronicle.objects.get(acronym=self.chronicle).players_starting_freebies
            logger.info(f'{self.name} expected freebies is {self.expectedfreebies} (Player)')
        else:
            self.expectedfreebies = self.freebies_per_age_threshold
            logger.info(f'{self.name} expected freebies is {self.expectedfreebies} (NPC)')
        # Willpower
        if self.willpower < self.virtue2:
            self.willpower = self.virtue2
        # Humanity
        from collector.utils.wod_reference import ENLIGHTENMENT
        if self.path not in ENLIGHTENMENT:
            self.path = 'Humanity'
        self.virtue_name0 = ENLIGHTENMENT[self.path]['virtues'][0]
        self.virtue_name1 = ENLIGHTENMENT[self.path]['virtues'][1]
        self.virtue_name2 = ENLIGHTENMENT[self.path]['virtues'][2]

        if self.humanity < self.virtue0 + self.virtue1:
            self.humanity = self.virtue0 + self.virtue1
        # Bloodpool
        self.bloodpool = bloodpool[13 - self.value_of('generation')]
        self.family = self.family.title()
        self.weakness = CLANS_SPECIFICS[self.family]['clan_weakness']
        self.display_gauge = self.value_of('generation') * 2 + self.value_of('status') * 2
        self.display_pole = self.groupspec
        self.disciplinepoints = self.total_traits
        if self.player:
            if self.experience > 0:
                self.exp_pool = self.experience - self.exp_spent

    def fix_ghoul(self):
        self.display_gauge = 2
        if self.embrace == 0:
            self.embrace = chronicle.era - (self.trueage - self.age)
        self.trueage = chronicle.era - (self.embrace - self.age)
        if self.sire:
            # if self.family == '':
            print(self.sire)
            domitor = Creature.objects.get(rid=self.sire)
            if domitor:
                self.family = domitor.family
                self.faction = domitor.faction
                self.display_gauge = domitor.display_gauge / 3
                self.group = "Ghoul of " + domitor.name
                self.groupspec = domitor.groupspec
                self.hidden = domitor.hidden
                if self.district is None:
                    self.district = domitor.district

        self.expectedfreebies = self.freebies_per_immortal_age
        self.bloodpool = 10
        self.display_gauge = int(self.trueage / 50)
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
        self.display_gauge = self.arete * 2

    def fix_garou(self):
        self.trueage = self.age


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
        self.expectedfreebies = self.freebies_per_mortal_age + expected_freebies_by_rank[int(self.rank) - 1]

    @property
    def freebies_per_mortal_age(self):
        return (int((int(self.age) - 25) / 10) + 1) * 10

    @property
    def freebies_per_immortal_age(self):
        return int(((int(self.trueage) - 10) / 5))

    def update_rid(self):
        self.rid = toRID(self.name)

    def fix(self):
        logger.info(f'Fixing ............ [{self.name}] [{self.creature}]')
        # at:3/3/3 ab:7/5/3 b:3 w:2 f:15
        self.freebies = -((3 + 3 + 3 + 9) * 5 + (7 + 5 + 3) * 2 + 3 + 2 + 15)
        if 'changeling' == self.creature:
            # traits:3 realms:5 backgrounds:5 willpower:4 glamour:4, banality:3 freebies:15
            self.freebies = -((7 + 5 + 3 + 9) * 5 + (13 + 9 + 5) * 2)
            self.freebies = -(3 * 5 + 5 * 2 + 5 * 1 + 4 + 4 * 3 - 3 + 15)
            self.fix_changeling()
        if 'kindred' == self.creature:
            # at:7/5/3 ab:13/9/5 b:5 d:21 v:7 wh:10 f:15
            self.freebies = 0
            self.freebies -= (7 + 5 + 3 + 9) * 5  # Attributes
            self.freebies -= (13 + 9 + 5) * 2  # Abilities
            self.freebies -= 3 * 7  # Disciplines
            self.freebies -= (7 + 3) * 2  # Virtues
            self.freebies -= 5 * 1  # Backgrounds
            self.freebies -= 15  # Pure freebies
            self.fix_kindred()
        elif 'garou' == self.creature:
            # at:7/5/3 ab:13/9/5 b:5 g:21 rgw:16 f:15
            self.freebies = 0
            self.freebies -= (7 + 5 + 3 + 9) * 5  # Attributes
            self.freebies -= (13 + 9 + 5) * 2     # Abilities
            self.freebies -= 3 * 7                # Gifts
            self.freebies -= 5 * 1                # Backgrounds
            self.freebies -= RAGE_PER_AUSPICE[self.auspice] * 1 # Rage per Auspice
            self.freebies -= GNOSIS_PER_BREED[self.breed] * 2 # Gnosis per Breed
            if self.family:
                self.freebies -= PER_TRIBE[as_tribe_plural(self.family)]['willpower'] * 1                # Willpower per Tribe
            else:
                self.freebies -= 3
            self.freebies -= 15                   # Pure freebies
            self.freebies
            self.fix_garou()
        elif 'mage' == self.creature:
            # at:7/5/3 ab:13/9/5 b:5 g:21 rgw:16 f:15
            self.freebies = -((7 + 5 + 3 + 9) * 5 + (13 + 9 + 5) * 2 + 5 + 7 * 3 + 16 + 15)
            self.fix_mage()
        elif 'ghoul' == self.creature:
            self.freebies = 0
            self.freebies -= (6 + 4 + 3 + 9) * 5  # Attributes
            self.freebies -= (11 + 7 + 5) * 2  # Abilities
            self.freebies -= 1 * 7  # Disciplines
            self.freebies -= 7 * 1  # Backgrounds
            self.freebies -= 21  # Pure freebies
            self.fix_ghoul()
        elif 'kinfolk' == self.creature:
            # at:6/4/3 ab:11/7/4 b:5 w:3 f:21
            self.freebies = -((6 + 4 + 3 + 9) * 5 + (11 + 7 + 4) * 2 + 5 + 3 + 21)
            self.fix_kinfolk()
        elif 'fomori' == self.creature:
            self.freebies = -((6 + 4 + 3 + 9) * 5 + (11 + 7 + 4) * 2 + 5 + 3 + 21)
            self.fix_fomori()
        elif self.creature == 'wraith':
            self.freebies = -((7 + 5 + 3 + 9) * 5 + (13 + 9 + 5) * 2 + 5 * 5 + 7 + 10 + 10 + 5 * 2)
            self.fix_wraith()
        else:
            # self.creature = 'mortal'
            self.fix_mortal()

        self.expectedfreebies += self.extra
        self.summary = f'Freebies: {self.freebies}'
        self.calculate_freebies()
        # self.balance_ghoul()
        self.changeName()
        self.need_fix = False

    @property
    def roster_base(self):
        lines = []
        if (self.position):
            lines.append(f'<b>{self.position.title()}</b>')
        if (self.entrance):
            lines.append(f'<i>{self.entrance}</i>')
        if self.creature != 'ghoul':
            if (self.group):
                lines.append(f'<i>{self.group}</i>')
        if (self.groupspec):
            lines.append(f'<i>{self.groupspec}</i>')
        if (self.concept):
            lines.append(f'<b>Concept:</b> {self.concept}')

        # lines.append(f'<b>Creature Type:</b> {self.creature.title()}')
        if self.creature == 'kindred' or self.creature == 'ghoul':
            lines.append(f'<b>Age:</b> {self.age} (Real: {self.trueage}, Embrace: {self.embrace})')
        else:
            lines.append(f'<b>Age:</b> {self.age}')
        lines.append(f'<b>Nature (Demeanor):</b> {self.nature} ({self.demeanor})')
        if self.freebies == self.expectedfreebies:
            lines.append(f'<b>Freebies:</b> {self.freebies}')
        else:
            lines.append(f'<b>Freebies:</b> {self.freebies} ({self.expectedfreebies} / {self.freebiedif})')
        return "<br/>".join(lines)

    @property
    def roster_attributes(self):
        lines = []
        lines.append(
            f'<br/><b>Physical  <small>({self.total_physical})</small>:</b> Strength {self.attribute0}, Dexterity {self.attribute1}, Stamina {self.attribute2}')
        lines.append(
            f'<br/><b>Social  <small>({self.total_social})</small>:</b> Charisma {self.attribute3}, Manipulation {self.attribute4}, Appearance {self.attribute5}')
        lines.append(
            f'<br/><b>Mental <small>({self.total_mental})</small>:</b> Perception {self.attribute6}, Intelligence {self.attribute7}, Wits {self.attribute8}')
        return "".join(lines)

    @property
    def roster_talents(self):
        str = f'<br/><b>Talents <small>({self.total_talents})</small>:</b> '
        abilities_list = []
        topics = ['talents']
        for topic in topics:
            for ability in STATS_NAMES[self.creature][topic]:
                val = self.value_of(ability)
                if val > 0:
                    abilities_list.append(f'{ability.title()} {val}')
        str = str + ", ".join(abilities_list) + "."
        return str

    @property
    def roster_skills(self):
        str = f'<br/><b>Skills <small>({self.total_skills})</small>:</b> '
        abilities_list = []
        topics = ['skills']
        for topic in topics:
            for ability in STATS_NAMES[self.creature][topic]:
                val = self.value_of(ability)
                if val > 0:
                    abilities_list.append(f'{ability.title()} {val}')
        str = str + ", ".join(abilities_list) + "."
        return str

    @property
    def roster_knowledges(self):
        str = f'<br/><b>Knowledges <small>({self.total_knowledges})</small>:</b> '
        abilities_list = []
        topics = ['knowledges']
        for topic in topics:
            for ability in STATS_NAMES[self.creature][topic]:
                val = self.value_of(ability)
                if val > 0:
                    abilities_list.append(f'{ability.title()} {val}')
        str = str + ", ".join(abilities_list) + "."
        return str

    @property
    def roster_end(self):
        lines = []
        backgrounds_list = []
        merits_list = []
        flaws_list = []
        topics = ['backgrounds']
        for topic in topics:
            for ability in STATS_NAMES[self.creature][topic]:
                val = self.value_of(ability)
                if val > 0:
                    backgrounds_list.append(f'{ability.title()} {val}')
        if len(backgrounds_list) > 0:
            lines.append(
                f'<br/><b>Backgrounds</b> <small>({self.total_backgrounds})</small>: {", ".join(backgrounds_list)}.')
        gifts_list = []
        for n in range(10):
            if getattr(self, f"trait{n}"):
                sentence = getattr(self, f"trait{n}")
                words = sentence.split("(")
                val = int(words[1].split(")")[0])
                gifts_list.append(f'{sentence.replace(" (", "&nbsp; (")}')
        if len(gifts_list) > 0:
            if self.creature == 'kindred' or self.creature == 'ghoul':
                lines.append(f'<br/><b>Disciplines</b>: {", ".join(gifts_list)}')
            else:
                lines.append(f'<br/><b>Gifts</b>: {", ".join(gifts_list)}')
        lines.append(f'<br/><b>Willpower</b>: {self.as_dot(self.willpower, max=20, to_spend=True)}')
        if self.creature == 'kindred' or self.creature == 'ghoul':
            lines.append(f'<br/><b>Blood Pool</b>: {self.as_dot(self.bloodpool, max=20, to_spend=True)}')
            lines.append(
                f'<br/><b>Conscience</b>:{self.as_dot(self.virtue0)}  <b>Self-control</b>:{self.as_dot(self.virtue1)}  <b>Courage</b>:{self.as_dot(self.virtue2)}')
        return "".join(lines) + "."

    @property
    def roster_shortcuts(self):
        lines = self.get_shortcuts()
        return "<b>Shortcuts:</b><br/>➤ " + "<br/>➤ ".join(lines) + "."

    def as_dot(self, value, max=5, to_spend=False):
        str = ""
        if to_spend:
            str = f"{value}"
            for x in range(value):
                if x % 5 == 0:
                    str += "-"
                str += "❍"

        else:
            for x in range(value):
                str += "●"
                if x % 5 == 4:
                    str += " "
            for x in range(max - value):
                str += "❍"
                if x % 5 == 4:
                    str += " "
        return str

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
        return "".join(lines)

    def extract_roster(self):
        return self.get_roster()

    def randomize_stats(self, stats_count=9, min_value=0, pools=[]):
        stats = []
        for n in range(stats_count):
            stats.append(min_value)
        random.shuffle(pools)
        pidx = 0
        set_length = int(stats_count / len(pools))
        print("Randomize Stats (", set_length, "stats per pool)")
        for p in pools:
            choices = [item for item in range(set_length)]
            weights = [pow(2, 6) for item in range(set_length)]
            while p > 0:
                a = random.choices(choices, weights=weights, k=1)[0]
                p -= 1
                stats[a + pidx * set_length] += 1
                weights[a] = weights[a] / 2
            pidx += 1
            print("POOLS=", pools, pidx, ") WEIGHTS=", weights, "ATTR=", stats)
        return stats

    def randomize_attributes(self):
        attributes_points = STATS_TEMPLATES[self.creature]['attributes'].split('/')
        pools = []
        for x in range(3):
            pools.append(int(attributes_points[x]))
        attributes = self.randomize_stats(stats_count=9, min_value=1, pools=pools)
        for x in range(9):
            setattr(self, f'attribute{x}', attributes[x])
        self.need_fix = True

    def randomize_abilities(self):
        abilities_points = STATS_TEMPLATES[self.creature]['abilities'].split('/')
        pools = []
        for x in range(3):
            pools.append(int(abilities_points[x]))
        abilities = self.randomize_stats(stats_count=30, min_value=0, pools=pools)
        for t in range(10):
            setattr(self, f'talent{t}', abilities[t])
            setattr(self, f'skill{t}', abilities[t + 10])
            setattr(self, f'knowledge{t}', abilities[t + 20])
        self.need_fix = True

    def randomize_backgrounds(self):
        background_points = int(STATS_TEMPLATES[self.creature]['backgrounds'])
        pools = []
        pools.append(int(background_points))
        backgrounds = self.randomize_stats(stats_count=10, min_value=0, pools=pools)
        for i in range(10):
            setattr(self, f'background{i}', backgrounds[i])
        self.need_fix = True

    def randomize_archetypes(self):
        if not self.nature:
            self.nature = random.choice(ARCHETYPES)
        if not self.demeanor:
            self.demeanor = random.choice(ARCHETYPES)

    def randomize_disciplines(self):
        if self.family:
            for i in range(16):
                setattr(self, f'trait{i}', '')
            x = 0
            for d in CLANS_SPECIFICS[self.family]['disciplines']:
                setattr(self, f'trait{x}', d)
                x += 1

    def randomize_all(self):
        self.randomize_attributes()
        self.randomize_abilities()
        self.randomize_archetypes()
        self.randomize_backgrounds()
        if self.creature == 'kindred':
            if self.family:
                self.randomize_disciplines()
            virtues = 7
            self.virtue0 = 1
            self.virtue1 = 1
            self.virtue2 = 1
            while virtues > 0:
                a = random.randrange(0, 3)
                v = getattr(self, f'virtue{a}')
                if v < 5:
                    setattr(self, f'virtue{a}', v + 1)
                    virtues -= 1
            self.weakness = CLANS_SPECIFICS[self.family]['clan_weakness']
        if self.creature == 'ghoul':
            self.virtue0 = 0
            self.virtue1 = 0
            self.virtue2 = 0
            for x in range(4):
                setattr(self, f'merit{x}', '');
                setattr(self, f'flaw{x}', '');
            for x in range(16):
                setattr(self,f'trait{x}','');
            due_willpower = int(STATS_TEMPLATES[self.creature]['willpower'])
            # if self.willpower < due_willpower:
            self.willpower = due_willpower

    def balance_ghoul(self):
        if self.creature == "ghoul":
            discipline_points = 0
            print(f"=> BALANCE GHOUL [{self.name}].")
            offset = self.expectedfreebies - self.freebies
            while offset > 0:
                str = ''
                str += f'[offset={offset:3}] '
                solution_pick = []
                if offset >= 15:
                    solution_pick.append(1)
                if offset > 5:
                    solution_pick.append(2)
                    solution_pick.append(2)
                if offset >= 2:
                    solution_pick.append(3)
                    solution_pick.append(3)
                    solution_pick.append(3)
                if offset >= 1:
                    solution_pick.append(4)
                    solution_pick.append(4)
                random.shuffle(solution_pick)
                solution = random.choice(solution_pick)
                # str += f'[{",".join(solution_pick)} -> {solution:2}]'
                if solution == 1:
                    str += f'[{f"DISCIPLINES +1]":30}'
                    discipline_points += 1
                    offset -= 7
                    str += "[spend -> 7]"
                if solution == 2:
                    str += f'[{f"ATTR {self.position}":30}]'
                    if self.position == "Intelligence":
                        targets = ["Perception", "Intelligence", "Wits"]
                    elif self.position == "Enforcer":
                        targets = ["Strength", "Dexterity", "Stamina"]
                    elif self.position == "Valet":
                        targets = ["Manipulation", "Appareance", "Perception"]
                    elif self.position == "Operative":
                        targets = ["Dexterity", "Manipulation", "Wits"]
                    elif self.position == "Leisure":
                        targets = ["Charisma", "Manipulation", "Appareance"]
                    r, l = self.increase_random_stat(targets)
                    if r == 1:
                        offset -= 5
                        str += l
                        str += "[spend -> 5]"
                if solution == 3:
                    str += f'[{f"SKILL {self.position}":30}]'
                    if self.position == "Intelligence":
                        targets = ["Politics", "Investigation", "Subterfuge", "Stealth", "Linguistics", "Academics"]
                    elif self.position == "Enforcer":
                        targets = ["Athletics", "Brawl", "Dodge", "Melee", "Intimidation", "Firearms"]
                    elif self.position == "Valet":
                        targets = ["Alertness", "Empathy", "Etiquette", "Drive", "Linguistics"]
                    elif self.position == "Operative":
                        targets = ["Survival", "Investigation", "Alertness", "Technology", "Stealth"]
                    elif self.position == "Leisure":
                        targets = ["Athletics", "Empathy", "Etiquette", "Performance", "Subterfuge"]
                    r, l = self.increase_random_stat(targets)
                    if r == 1:
                        offset -= 2
                        str += l
                        str += "[spend -> 2]"
                if solution == 4:
                    str += f'[{"Willpower/backgrounds":30}]'
                    targets = ["Willpower", "Allies", "Contacts", "Resources", "Equipment", "Innovation", "Trust",
                               "Bond"]
                    r, l = self.increase_random_stat(targets)
                    if r == 1:
                        offset -= 1
                        str += l
                        str += "[spend -> 1]"
                if str:
                    print(str)

            if discipline_points > 0:
                str = ''
                #potence, ref, tr = self.get_trait_value("Potence")
                str += f'[Boost potence --> value={discipline_points}]'
                self.set_trait_value("Potence", discipline_points)
                print(str)
            self.need_fix = True
            self.save()
            print(f'{self.name} has been balanced...')

    def increase_random_stat(self, stats_set=[]):
        res = 0
        log = ""
        choices = [0 for c in range(len(stats_set))]
        choices[random.randrange(len(stats_set))] = 1
        random.shuffle(choices)
        ch = 0
        for x in stats_set:
            stat = find_stat_property(self.creature, x)
            if stat == 'n/a':
                log  += f"[OOPS:{x}=>{stat}"
            else:
                old_value = getattr(self, stat)
                setattr(self, stat, choices[ch] + old_value)
                if choices[ch] == 1:
                    log += f"[Upgrading {x:20} by 1] "
                    res = 1
                    break
                ch += 1
        return res, log

    def extract_raw(self):
        # filename = f'./raw/{self.rid}.txt'
        lines = []
        lines.append(f'{self.name}\n')
        lines.append(f'Nature\t\t{self.nature}\tDemeanor\t{self.demeanor}\n')
        lines.append(f'Concept\t\t{self.concept}\tAge\t{self.age}\n')
        lines.append(
            f'Physical\t({self.total_physical})\tSocial\t({self.total_social})\tMental\t({self.total_mental})\n')
        lines.append(
            f'Strength\t{self.val_as_dots(self.attribute0)}\tCharisma\t{self.val_as_dots(self.attribute3)}\tPerception\t{self.val_as_dots(self.attribute6)}\n')
        lines.append(
            f'Dexterity\t{self.val_as_dots(self.attribute1)}\tManipulation\t{self.val_as_dots(self.attribute4)}\tIntelligence\t{self.val_as_dots(self.attribute7)}\n')
        lines.append(
            f'Stamina\t{self.val_as_dots(self.attribute2)}\tAppearance\t{self.val_as_dots(self.attribute5)}\tWits\t{self.val_as_dots(self.attribute8)}\n')
        lines.append(
            f'Talents\t({self.total_talents})\tSkills\t({self.total_skills})\tKnowledges\t({self.total_knowledges})\t\n')
        for n in range(10):
            lines.append(
                f'{STATS_NAMES[self.creature]["talents"][n]}\t{self.val_as_dots(getattr(self, f"talent{n}"))}\t{STATS_NAMES[self.creature]["skills"][n]}\t{self.val_as_dots(getattr(self, f"skill{n}"))}\t{STATS_NAMES[self.creature]["knowledges"][n]}\t{self.val_as_dots(getattr(self, f"knowledge{n}"))}\n')
        blines = []
        for n in range(10):
            if getattr(self, f"background{n}") > 0:
                blines.append(f'{STATS_NAMES[self.creature]["backgrounds"][n]} ({getattr(self, f"background{n}")})')
        lines.append(f'Backgrounds: {", ".join(blines)}.\n')
        glines = []
        for n in range(16):
            if getattr(self, f"trait{n}"):
                glines.append(f'{getattr(self, f"trait{n}")}')
        lines.append(f'Traits: {", ".join(glines)}.\n')
        return "".join(lines)

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
                s, v = self.str2pair(merit)
                if s:
                    self.freebies += v
            flaw = getattr(self, 'flaw%d' % (n))
            if flaw != '':
                s, v = self.str2pair(flaw)
                if s:
                    self.freebies -= v
        # Traits
        self.total_traits = 0
        for i in range(16):
            trait = getattr(self, f'trait{i}')
            # print(trait)
            if trait:
                s, v = self.str2pair(trait)
                if s:
                    self.total_traits += v
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
            self.freebies += self.total_realms * 2  # 2 pts per realm pts
        elif 'garou' == self.creature:
            self.freebies += getattr(self, 'rage')
            self.freebies += getattr(self, 'gnosis') * 2
            self.freebies += getattr(self, 'willpower')
            self.freebies += self.total_traits * 7  # 7 pts per gift level
        elif 'ghoul' == self.creature:
            self.freebies += self.total_traits * 7  # 7 pts per discipline pts
        elif 'kindred' == self.creature:
            # Virtues
            for i in range(3):
                self.freebies += getattr(self, f'virtue{i}') * 2
            self.freebies += getattr(self, 'humanity') - self.virtue0 - self.virtue1
            self.freebies += getattr(self, 'willpower') - self.virtue2
            self.freebies += self.total_traits * 7  # 7 pts per discipline pts
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
            self.freebies += self.total_fetters  # 1 pts per passion pts
        else:
            self.freebies += getattr(self, 'willpower')
        self.freebiesdif = self.expectedfreebies - self.freebies
        if self.freebiesdif == 0:
            self.status = 'OK'
        elif self.freebiesdif < 0:
            self.status = 'UNBALANCED'
        else:
            self.status = 'OK+'

    def str2pair(self, str):
        w = str.split(' (')
        if len(w) != 2:
            s = ""
            v = 0
            logger.warning(f"Warning str2pair: {str} --> [{s}][{v}]: computation might be broken!")
        else:
            s = w[0]
            v = int(w[1].replace(')', ''))
        return s, v

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
            'position': self.position,
            'status': self.status,
            'generation': self.generation,
            'ghouls': ",".join(self.retainers),
            'sire': self.sire,
            'index': 0,
            'is_dead': "dead_node" if self.condition.startswith("DEAD") else "",
            'total_traits': self.total_traits,
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
            'primogen': self.primogen,
            'faction': self.faction,
            'rid': self.rid,
            'id': 0,
            'key': self.id,
            'trueage': self.trueage,
            'is_ancient': self.isAncient,
            'children': [],
            'ghouls': ",".join(self.retainers)
        }
        return d

    @property
    def isAncient(self):
        res = 0
        if self.trueage > 1000:
            res = 5
        elif self.trueage > 500:
            res = 4
        elif self.trueage > 300:
            res = 3
        elif self.trueage > 150:
            res = 2
        elif self.trueage >= 50:
            res = 1
        return res

    def find_lineage(self, lockup=False):
        """ Find the full lineage for this character
        """
        lineage = self.toJSON()
        lineage['children'] = []
        lineage['generation'] = 13 - self.background3
        #infans = Creature.objects.filter(creature='kindred', sire=self.name)
        infans = Creature.objects.filter(creature='kindred', sire=self.rid)
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
            ghouls = Creature.objects.filter(sire=self.rid, creature='ghoul').order_by('-trueage', 'position')
            cnt = self.value_of('retainers')
            for g in ghouls:
                list.append(f'{g.name} ({g.position}/{g.trueage})')
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

    def debuff(self):
        for i in range(10):
            setattr(self, f'trait{i}', '')
        for i in range(5):
            setattr(self, f'merit{i}', '')
            setattr(self, f'flaw{i}', '')
        for i in range(3):
            setattr(self, f'virtue{i}', 0)
        if self.breed == 0:  # homid
            self.virtue0 = 5
        elif self.breed == 1:  # metis
            self.virtue0 = 3
        elif self.breed == 2:  # lupus
            self.virtue0 = 1
        if self.auspice == 0:  # ragabash
            self.virtue2 = 1
        elif self.auspice == 1:  # theurge
            self.virtue2 = 2
        elif self.auspice == 2:  # galliard
            self.virtue2 = 3
        elif self.auspice == 3:  # philodox
            self.virtue2 = 4
        elif self.auspice == 4:  # ahroun
            self.virtue2 = 5
        kn = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for i in range(10):
            kn[i] = getattr(self, f'knowledge{i}')
        for i in range(7):
            setattr(self, f'knowledge{i + 1}', kn[i])
        setattr(self, f'knowledge0', 0)
        setattr(self, f'knowledge9', kn[9])
        setattr(self, f'background1', 0)
        setattr(self, f'background3', 0)
        setattr(self, f'background4', 0)
        setattr(self, f'background5', 0)
        setattr(self, f'background6', 0)
        setattr(self, f'background8', 0)
        setattr(self, f'background9', 0)

    def background_notes(self):
        fmt_list = []
        from collector.models.backgrounds import Background
        backgrounds = ['allies', 'contacts', 'fame', 'generation', 'herd', 'influence', 'mentor', 'resources',
                       'retainers', 'status', 'kinfolk', 'pure breed', 'ancestors', 'rites']
        idx = 0
        for b in backgrounds:
            print(b)
            v = self.value_of(b)
            if v > 0:
                txt_lines = []
                entries = Background.objects.filter(name=b.title(), level__lte=v).order_by('level')
                if len(entries) > 0:
                    if entries.first().cumulate:
                        for e in entries:
                            txt_lines.append(e.description)
                    else:
                        txt_lines.append(entries.last().description)
                print(b, v, txt_lines)
                x = "\n".join(txt_lines)
                fmt_list.append({'idx': idx, 'item': f'{b.title()} [{v}] ', 'notes': f'{x}'})
                idx += 1

        list = self.notes_on_backgrounds.split('\r\n');
        fmt_list = []
        idx = 0;
        for e in list:
            print(e)
            if len(e) > 2:
                words = e.split('§');
                fmt_list.append({'idx': idx, 'item': f'{words[0]}', 'notes': f'{words[1]}'})
                idx += 1

        return fmt_list

    def timeline(self):
        list = self.notes_on_history.split('\r\n')
        fmt_list = []
        idx = 0
        for e in list:
            if len(e) > 2:
                words = e.split('§')
                fmt_list.append({'idx': idx, 'item': f'{words[0]}', 'date': f'{words[1]}', 'notes': f'{words[2]}'})
                idx += 1

        return fmt_list

    def traits_notes(self):
        fmt_list = []
        idx = 0
        if self.creature in ["kindred", "ghoul"]:
            from collector.models.disciplines import Discipline
            extended_traits = []
            traits = self.get_traits()
            for t in traits:
                words = t.split(' (')
                d = words[0]
                v = words[1]
                v2 = v[:-1]
                v3 = int(v2)
                print(t, ":", d, ":", v, ":", v2, ":", v3)
                for y in range(v3):
                    extended_traits.append(f'{d} ({y + 1})')
            print(extended_traits)
            all = Discipline.objects.filter(code__in=extended_traits).order_by('name', 'level')
            for z in all:
                if z.is_linear:
                    prefix = z.name
                    for x in extended_traits:
                        if x.startswith(prefix):
                            extended_traits.remove(x)
                    extended_traits.append(z.code)
            print(extended_traits)
            list = []
            for et in reversed(extended_traits):
                print(et)
                zs = Discipline.objects.filter(code=et)
                if len(zs) > 0:
                    z = zs.first()
                    a = z.name.upper()
                    b = str(z.level)
                    c = z.alternative_name
                    d = z.technical_notes
                    list.append(f"{a}§{b}§{c}§{d}")
        elif self.creature in ["garou"]:
            from collector.models.gifts import Gift
            extended_traits = []
            traits = self.get_traits()
            print("traits",traits)
            for t in traits:
                words = t.split(' (')
                d = words[0]
                v = words[1]
                v2 = v[:-1]
                v3 = int(v2)
                print(t, ":", d, ":", v, ":", v2, ":", v3)
                for y in range(v3):
                    extended_traits.append(f'{d} ({y + 1})')
            # all = Gift.objects.filter(code__in=extended_traits).order_by('name', 'level')
            # for z in all:
            #     if z.is_linear:
            #         prefix = z.name
            #         for x in extended_traits:
            #             if x.startswith(prefix):
            #                 extended_traits.remove(x)
            #         extended_traits.append(z.code)
            # print(extended_traits)
            list = []
            for et in reversed(traits):
                print("Looking for... ",et)
                traits = Gift.objects.filter(code=et.upper())
                if len(traits) > 0:
                    trait = traits.first()
                    a = trait.name
                    b = str(trait.level)
                    c = trait.alternative_name
                    d = trait.description + " µ -- System -- µ "+trait.system
                    list.append(f"{a}§{b}§{c}§{d}")
                else:
                    print(f"Discarded... {et}")

        else:
            list = self.notes_on_traits.split('\r\n');
        print("List -->",list)
        for e in list:
            if len(e) > 2:
                words = e.split('§')
                fmt_list.append(
                    {'idx': idx, 'item': f'{words[0].upper()}', 'score': f'{words[1]}', 'title': f'{words[2]}',
                     'notes': f'{words[3]}'})
                idx += 1
        return fmt_list

    def nature_notes(self):
        fmt_list = []
        from collector.models.archetypes import Archetype
        archetypes = Archetype.objects.filter(name=self.nature.lower())
        if len(archetypes) == 1:
            archetype = archetypes.first()
            fmt_list.append({'idx': 0, 'item': f'{archetype.name.upper()}', 'notes': f'{archetype.system}',
                             'description': f'{archetype.description}'})
        archetypes = Archetype.objects.filter(name=self.demeanor.lower())
        if len(archetypes) == 1:
            archetype = archetypes.first()
            fmt_list.append({'idx': 1, 'item': f'{archetype.name.upper()} (demeanor)', 'notes': f'',
                             'description': f'{archetype.description}'})

        # else:
        #     list = self.notes_on_naturedemeanor.split('\r\n');
        #     idx = 0
        #     for e in list:
        #         if len(e) > 2:
        #             words = e.split('§')
        #             fmt_list.append({'idx': idx, 'item': f'{words[0].upper()}', 'notes': f'{words[1]}'})
        #             idx += 1
        return fmt_list

    def meritsflaws_notes(self):
        list = self.notes_on_meritsflaws.split('\r\n');
        fmt_list = []
        idx = 0
        for e in list:
            if len(e) > 2:
                words = e.split('§')
                fmt_list.append(
                    {'idx': idx, 'item': f'{words[0].upper()}', 'type': f'{words[1]}', 'value': f'{words[2]}',
                     'notes': f'{words[3]}'})
                idx += 1
        return fmt_list

    def discipline_helpers(self):
        if self.creature in ["kindred", "ghoul"]:
            from collector.models.disciplines import Discipline
            pass


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


def no_longer_new(modeladmin, request, queryset):
    for creature in queryset:
        creature.is_new = False
        creature.need_fix = True
        creature.save()
    short_description = 'No longer new'


def push_to_newyork(modeladmin, request, queryset):
    for creature in queryset:
        creature.chronicle = 'UNY'
        creature.need_fix = True
        creature.save()
    short_description = 'Push to New York City'


def push_to_munich(modeladmin, request, queryset):
    for creature in queryset:
        creature.chronicle = 'GMU'
        creature.need_fix = True
        creature.save()
    short_description = 'Push to Munich'


def push_to_hamburg(modeladmin, request, queryset):
    for creature in queryset:
        creature.chronicle = 'GHH'
        creature.need_fix = True
        creature.save()
    short_description = 'Push to the Hamburg'


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
        'name', 'age', 'trueage', 'nature', 'chronicle', 'hidden', 'adventure', 'freebies', 'player',
        'district',
        'family', 'groupspec', 'sire', 'status', 'condition']
    ordering = ['-trueage', 'name', 'group', 'creature']
    actions = [no_longer_new, randomize_backgrounds, randomize_all, randomize_archetypes, randomize_attributes,
               randomize_abilities,
               refix, set_male, set_female, push_to_munich, push_to_newyork, push_to_hamburg]
    list_filter = ['chronicle', 'hidden', 'adventure', 'district', 'faction', 'family', 'is_new', 'condition', 'group',
                   'groupspec',
                   'creature', 'mythic', 'ghost']
    search_fields = ['name', 'groupspec']
    list_editable = ['adventure', 'hidden', 'nature', 'district', 'player', 'condition', "family"]
