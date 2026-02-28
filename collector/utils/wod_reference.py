from collector.models.adventures import Adventure
from collector.models.chronicles import Chronicle
import logging

from collector.models.seasons import Season

logger = logging.Logger(__name__)

FONTSET = ['Cinzel', 'Trade+Winds', 'Imprima', 'Roboto', 'Philosopher', 'Ruda', 'Khand', 'Allura', 'Gochi+Hand',
           'Reggae+One', 'Whisper', 'Licorice', 'Damion', 'Allison', 'Syne+Mono', 'Zilla+Slab', 'Spartan',
           'Marcellus+SC', 'Lato', 'Atma', 'Splash', 'Trirong', 'Ubuntu+Mono', 'Inria+Sans', "Spectral+SC", "Hi+Melody",
           "East+Sea+Dokdo", "Slackside+One", "Do+Hyeon", "Tac+One"]


def get_current_chronicle():
    # When migrating
    # return None
    ch = None
    # try:
    #     current_chronicle = Chronicle.objects.filter(is_current=True).first()
    #     ch = current_chronicle
    # except:
    #     first_chronicle = Chronicle.objects.first()
    #     first_chronicle.is_current = True
    #     first_chronicle.is_storyteller_only = True
    #     first_chronicle.save()
    #     ch = first_chronicle
    #     print(f"Error with get_chronicle {ch}")
    # return ch
    return Chronicle.current()


def set_chronicle(acro):
    for a in Adventure.objects.all():
        if a.acronym == acro:
            a.is_current = True
            print(f'Current Adventure set to {a.acronym}.')
        else:
            a.is_current = False
        a.save()
    for s in Season.objects.all():
        if s.acronym == acro:
            s.is_current = True
            print(f'Current Season set to {s.acronym}.')
        else:
            s.is_current = False
        s.save()
    for c in Chronicle.objects.all():
        if c.acronym == acro:
            c.is_current = True
            print(f'Current Chronicle set to {c.acronym}.')
        else:
            c.is_current = False
        c.save()
    c = get_current_chronicle()
    #print(f'Current Chronicle set to is {c.acronym}.')


def find_stat_property(creature, statistic):
    # You give 'kindred' / 'generation', it returns 'background3'
    lists = ['attributes', 'talents', 'skills', 'knowledges', 'backgrounds']
    property = 'n/a'
    for list in lists:
        if statistic.lower() in STATS_NAMES[creature][list]:
            property = f'{list[:-1]}{STATS_NAMES[creature][list].index(statistic.lower())}'
            # print(f'Parsing --> {property}')
            break
    if statistic.lower() == "willpower":
        property = "willpower"
    return property


def find_stat_category(creature, statistic):
    # You give 'garou' / 'athletics', it returns 'talents'
    lists = ['attributes', 'talents', 'skills', 'knowledges', 'backgrounds']
    result = 'n/a'
    if statistic.lower() in ["rage", "willpower"]:
        result = "low_rate"
    elif statistic.lower() in ["gnosis", "virtues", "humanity"]:
        result = "high_rate"
    elif statistic.lower() == "gift_in":
        result = "gift_in"
    elif statistic.lower() == "disc_in":
        result = "disc_in"
    elif statistic.lower() == "disc_ext":
        result = "disc_ext"
    elif statistic.lower() == "disc_out":
        result = "disc_out"
    elif statistic.lower() == "gift_out":
        result = "gift_out"
    elif statistic.lower() == "loss":
        result = "loss"
    if result == "n/a":
        for l in lists:
            if statistic.lower() in STATS_NAMES[creature][l]:
                result = l
                break
    return result


STATS_NAMES = {
    'changeling': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'brawl', 'empathy', 'expression', 'intimidation', 'kenning', 'leadership',
                    'streetwise', 'subterfuge'],
        'skills': ['animal ken', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance',
                   'stealth', 'survival'],
        'knowledges': ['computer', 'enigmas', 'investigation', 'law', 'linguistics', 'medicine', 'mythlore', 'occult',
                       'politics',
                       'science'],
        'backgrounds': ['chimera', 'contacts', 'dreamers', 'gremayre', 'holdings', 'mentor', 'resources', 'retinue',
                        'title', 'treasures'],
        'sheet': {'pages': 1}
    },
    'fomori': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'intuition',
                    'streetwise', 'subterfuge'],
        'skills': ['animal ken', 'crafts', 'drive', 'etiquette', 'firearms', 'leadership', 'melee', 'performance',
                   'stealth', 'survival'],
        'knowledges': ['bureaucracy', 'computer', 'enigmas', 'investigation', 'law', 'linguistics', 'medicine',
                       'occult', 'politics', 'science'],
        'backgrounds': ['allies', 'career', 'contacts', 'fame', 'family', 'equipment', 'influence',
                        'resources', 'status', 'true faith'],
        'sheet': {'pages': 1}
    },

    'garou': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness',
                    'athletics',
                    'brawl',
                    'empathy',
                    'expression',
                    'intimidation',
                    'leadership',
                    'primal-urge',
                    'streetwise',
                    'subterfuge'
                    ],
        'skills': ['animal ken',
                   'crafts',
                   'drive',
                   'etiquette',
                   'firearms',
                   'larceny',
                   'melee',
                   'performance',
                   'stealth',
                   'survival'
                   ],
        'knowledges': ['academics',
                       'computer',
                       'enigmas',
                       'investigation',
                       'law',
                       'medicine',
                       'occult',
                       'rituals',
                       'science',
                       'technology',
                       ],
        'backgrounds': ['allies', 'ancestors', 'contacts', 'fate', 'fetish', 'kinfolk', 'mentor', 'pure breed',
                        'resources',
                        'rites', 'spirit heritage', 'totem'],
        'sheet': {'pages': 4}
    },
    'ghoul': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],

        'talents': ['alertness',
                    'athletics',
                    'awareness',
                    'brawl',
                    'empathy',
                    'expression',
                    'intimidation',
                    'leadership',
                    'streetwise',
                    'subterfuge'
                    ],
        'skills': ['animal ken',
                   'crafts',
                   'drive',
                   'etiquette',
                   'firearms',
                   'larceny',
                   'melee',
                   'performance',
                   'stealth',
                   'survival'
                   ],
        'knowledges': ['academics',
                       'computer',
                       'finance',
                       'investigation',
                       'law',
                       'medicine',
                       'occult',
                       'politics',
                       'science',
                       'technology',
                       ],

        'backgrounds': ['allies', 'bond', 'contacts', 'equipement', 'fame', 'family', 'influence', 'mentor',
                        'resources', 'trust'],
        'sheet': {'pages': 1},
        'freebies_per_dot': {
            "attribute": 5,
            "ability": 2,
            "trait": 10,
            "background": 1,
            "humanity": 1,
            "virtue": 2,
            "willpower": 1,
        }
    },
    'kindred': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness',
                    'athletics',
                    'awareness',
                    'brawl',
                    'empathy',
                    'expression',
                    'intimidation',
                    'leadership',
                    'streetwise',
                    'subterfuge'
                    ],
        'skills': ['animal ken',
                   'crafts',
                   'drive',
                   'etiquette',
                   'firearms',
                   'larceny',
                   'melee',
                   'performance',
                   'stealth',
                   'survival'
                   ],
        'knowledges': ['academics',
                       'computer',
                       'finance',
                       'investigation',
                       'law',
                       'medicine',
                       'occult',
                       'politics',
                       'science',
                       'technology',
                       ],

        'backgrounds': ['allies', 'contacts', 'fame', 'generation', 'herd', 'influence', 'mentor',
                        'resources', 'retainers', 'status'],
        'sheet': {'pages': 4},
        'freebies_per_dot': {
            "attribute": 5,
            "ability": 2,
            "trait": 7,
            "background": 1,
            "humanity": 2,
            "virtue": 2,
            "willpower": 1,
        }
    },
    'kinfolk': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness',
                    'athletics',
                    'brawl',
                    'empathy',
                    'expression',
                    'intimidation',
                    'leadership',
                    'primal-urge',
                    'streetwise',
                    'subterfuge'
                    ],
        'skills': ['animal ken',
                   'crafts',
                   'drive',
                   'etiquette',
                   'firearms',
                   'larceny',
                   'melee',
                   'performance',
                   'stealth',
                   'survival'
                   ],
        'knowledges': ['academics',
                       'computer',
                       'enigmas',
                       'investigation',
                       'law',
                       'medicine',
                       'occult',
                       'rituals',
                       'science',
                       'technology',
                       ],
        'backgrounds': ['allies', 'contacts', 'equipment', 'mentor', 'pure-breed', 'resources'],
        'sheet': {'pages': 1}
    },
    'mage': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation',
                    'leadership',
                    'streetwise', 'subterfuge'],
        'skills': ['crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'meditation', 'melee', 'performance',
                   'stealth', 'survival'],
        'knowledges': ['academics', 'computer', 'cosmology', 'enigmas', 'investigation', 'law',
                       'medicine', 'occult', 'science', 'technology'],
        'backgrounds': ['allies', 'arcane', 'avatar', 'contacts', 'destiny', 'dream', 'influence', 'library', 'node',
                        'resources', 'wonder'],
        'sheet': {'pages': 4}
    },
    'mortal': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness',
                    'athletics',
                    'brawl',
                    'empathy',
                    'expression',
                    'intimidation',
                    'leadership',
                    'primal-urge',
                    'streetwise',
                    'subterfuge'
                    ],
        'skills': ['animal ken',
                   'crafts',
                   'drive',
                   'etiquette',
                   'firearms',
                   'larceny',
                   'melee',
                   'performance',
                   'stealth',
                   'survival'
                   ],
        'knowledges': ['academics',
                       'computer',
                       'enigmas',
                       'investigation',
                       'law',
                       'medicine',
                       'occult',
                       'rituals',
                       'science',
                       'technology',
                       ],
        'backgrounds': ['allies', 'career', 'contacts', 'fame', 'family', 'equipment', 'influence',
                        'resources', 'status', 'true faith'],
        'sheet': {'pages': 1}
    },
    'kithain': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'intuition',
                    'streetwise', 'subterfuge'],
        'skills': ['animal ken', 'crafts', 'drive', 'etiquette', 'firearms', 'leadership', 'melee', 'performance',
                   'stealth', 'survival'],
        'knowledges': ['academics', 'computer', 'enigmas', 'investigation', 'law', 'linguistics', 'medicine',
                       'occult', 'politics', 'science'],
        'backgrounds': ['allies', 'career', 'contacts', 'fame', 'family', 'equipment', 'influence',
                        'resources', 'status', 'true faith'],
        'sheet': {'pages': 1}
    },

    'spirit': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'awareness', 'brawl', 'dodge', 'expression', 'intimidation', 'leadership',
                    'streetwise', 'subterfuge'],
        'skills': ['crafts', 'drive', 'etiquette', 'firearms', 'meditation', 'melee', 'performance',
                   'stealth', 'survival', 'technology'],
        'knowledges': ['academics', 'computer', 'cosmology', 'enigmas', 'investigation', 'law', 'linguistics',
                       'medicine', 'occult', 'science'],
        'backgrounds': ['allies', 'arcane', 'avatar', 'contacts', 'destiny', 'dream', 'influence', 'library', 'node',
                        'resources', 'wonder'],
        'sheet': {'pages': 1}
    },
    'wraith': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'awareness', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation',
                    'streetwise', 'subterfuge'],
        'skills': ['crafts', 'drive', 'etiquette', 'firearms', 'leadership', 'meditation', 'melee', 'performance',
                   'repair', 'stealth'],
        'knowledges': ['bureaucracy', 'computer', 'enigmas', 'investigation', 'law', 'linguistics', 'medicine',
                       'occult',
                       'politics', 'science'],
        'backgrounds': ['allies', 'artifact', 'contacts', 'eidolon', 'haunt', 'mentor', 'memoriam', 'notoriety',
                        'status', 'wealth'],
        'sheet': {'pages': 4}
    },
}

STATS_TEMPLATES = {
    'changeling': {
        'attributes': '7/5/3',
        'abilities': '13/9/5',
        'traits': '3',
        'realms': '5',
        'glamour': '4',
        'willpower': '4',
        'banality': '3',
        'backgrounds': '5',
        'freebies': '15'
    },
    'fomori': {
        'attributes': '6/4/3',
        'abilities': '11/7/5',
        'traits': '1',
        'backgrounds': '7',
        'willpower': '3',
        'freebies': '21'
    },
    'garou': {
        'attributes': '7/5/3',
        'abilities': '13/9/5',
        'traits': '3',
        'backgrounds': '5',
        'freebies': '15'
    },
    'ghoul': {
        'attributes': '6/4/3',
        'abilities': '11/7/4',
        'disciplines': '2',
        'backgrounds': '5',
        'virtues': '10',
        'virtues': '10',
    },
    'kindred': {
        'attributes': '7/5/3',
        'abilities': '13/9/5',
        'disciplines': '3',
        'backgrounds': '5',
        'virtues': '10',
        'freebies': '15'
    },
    'kinfolk': {
        'attributes': '6/4/3',
        'abilities': '11/7/4',
        'traits': '0',
        'backgrounds': '5',
        'willpower': '3',
        'freebies': '21'
    },
    'kithain': {
        'attributes': '6/4/3',
        'abilities': '11/7/5',
        'traits': '0',
        'backgrounds': '5',
        'willpower': '3',
        'freebies': '21'
    },
    'mage': {
        'attributes': '7/5/3',
        'abilities': '13/9/5',
        'arete': '1',
        'spheres': '5',
        'backgrounds': '7',
        'willpower': '5',
        'freebies': '15'
    },
    'mortal': {
        'attributes': '6/4/3',
        'abilities': '11/7/5',
        'traits': '0',
        'discipline': '0',
        'backgrounds': '5',
        'willpower': '3',
        'freebies': '21'
    },
    'spirit': {
        'attributes': '7/5/3',
        'abilities': '13/9/5',
        'traits': '5',
        'backgrounds': '5',
        'freebies': '15'
    },
    'wraith': {
        'attributes': '7/5/3',
        'abilities': '13/9/5',
        'arcanos': '5',
        'passions': '10',
        'fetters': '10',
        'backgrounds': '7',
        'willpower': '5',
        'pathos': '5',
        'freebies': '15'
    },

}


def from_stats(creature, stats):
    result = 0
    src = STATS_TEMPLATES[creature]
    if stats in src:
        data = src[stats]
        for v in data.split('/'):
            result += int(v)
    else:
        print(f"Error: {creature} has no stats template for {stats}. Returning 0.")
    return result


ARCHETYPES = [
    'Alpha',
    'Architect',
    'Autocrat',
    'Avant-garde',
    'Bon Vivant',
    'Bravo',
    'Builder',
    'Bureaucrat',
    'Caregiver',
    'Celebrant',
    'Child',
    'Competitor',
    'Confident',
    'Conformist',
    'Conniver',
    'Critic',
    'Curmudgeon',
    'Deviant',
    'Director',
    'Explorer',
    'Fanatic',
    'Follower',
    'Gallant',
    'Hedonist',
    'Jester',
    'Judge',
    'Loner',
    'Martyr',
    'Masochist',
    'Monster',
    'Pedagogue',
    'Penitent',
    'Perfectionist',
    'Predator',
    'Rebel',
    'Reluctant',
    'Rogue',
    'Show off',
    'Survivor',
    'Thrill-seeker',
    'Traditionalist',
    'Trickster',
    'Visionary'
]

BREEDS = ['Homid', 'Metis', 'Lupus']

AUSPICES = ['Ragabash', 'Theurge', 'Philodox', 'Galliard', 'Ahroun']

GAROU_RANKING_PER_AUSPICE = [
    [  # Ragabash
        {'total': 0, 'glory': -1, 'honor': -1, 'wisdom': -1},
        {'total': 3, 'glory': -1, 'honor': -1, 'wisdom': -1},
        {'total': 7, 'glory': -1, 'honor': -1, 'wisdom': -1},
        {'total': 12, 'glory': -1, 'honor': -1, 'wisdom': -1},
        {'total': 17, 'glory': -1, 'honor': -1, 'wisdom': -1},
        {'total': 24, 'glory': -1, 'honor': -1, 'wisdom': -1}
    ],
    [  # Theurge
        {'total': -1, 'glory': 0, 'honor': 0, 'wisdom': 0},
        {'total': -1, 'glory': 0, 'honor': 0, 'wisdom': 3},
        {'total': -1, 'glory': 1, 'honor': 0, 'wisdom': 5},
        {'total': -1, 'glory': 2, 'honor': 1, 'wisdom': 7},
        {'total': -1, 'glory': 4, 'honor': 2, 'wisdom': 9},
        {'total': -1, 'glory': 5, 'honor': 3, 'wisdom': 10}
    ],
    [  # Philodox
        {'total': -1, 'glory': 0, 'honor': 0, 'wisdom': 0},
        {'total': -1, 'glory': 0, 'honor': 3, 'wisdom': 0},
        {'total': -1, 'glory': 1, 'honor': 5, 'wisdom': 1},
        {'total': -1, 'glory': 3, 'honor': 7, 'wisdom': 4},
        {'total': -1, 'glory': 3, 'honor': 9, 'wisdom': 7},
        {'total': -1, 'glory': 4, 'honor': 10, 'wisdom': 9}
    ],
    [  # Galliard
        {'total': -1, 'glory': 0, 'honor': 0, 'wisdom': 0},
        {'total': -1, 'glory': 2, 'honor': 0, 'wisdom': 1},
        {'total': -1, 'glory': 4, 'honor': 0, 'wisdom': 3},
        {'total': -1, 'glory': 6, 'honor': 1, 'wisdom': 5},
        {'total': -1, 'glory': 8, 'honor': 2, 'wisdom': 6},
        {'total': -1, 'glory': 10, 'honor': 3, 'wisdom': 8}
    ],
    [  # Ahroun
        {'total': -1, 'glory': 0, 'honor': 0, 'wisdom': 0},
        {'total': -1, 'glory': 2, 'honor': 1, 'wisdom': 0},
        {'total': -1, 'glory': 5, 'honor': 3, 'wisdom': 1},
        {'total': -1, 'glory': 7, 'honor': 5, 'wisdom': 1},
        {'total': -1, 'glory': 9, 'honor': 7, 'wisdom': 2},
        {'total': -1, 'glory': 10, 'honor': 8, 'wisdom': 3}
    ],
]


def garou_rank_from_renown(dataset={"auspice": 0, "glory": 0, "honor": 0, "wisdom": 0}):
    rank = -1
    auspice_subset = GAROU_RANKING_PER_AUSPICE[dataset["auspice"]]
    idx = 0
    total = dataset["glory"] + dataset["honor"] + dataset["wisdom"]
    for line in auspice_subset:
        if line["total"] == -1:
            if dataset["glory"] >= line["glory"] and \
                    dataset["honor"] >= line["honor"] and \
                    dataset["wisdom"] >= line["wisdom"]:
                rank = idx
        else:
            if total >= line["total"]:
                rank = idx
        idx += 1
    print(f"Rank -->{rank:2}")
    return rank


RANKS = ['Pup', 'Cliath', 'Fostern', 'Adren', 'Athro', 'Elder']

CHARACTERS_PER_PAGE = 16

ALL_TRIBES = [
    "Black Furies",
    "Black Spiral Dancers",
    "Bone Gnawers",
    "Bunyips",
    "Children of Gaia",
    "Croatans",
    "Fiannas",
    "Gets of Fenris",
    "Glass Walkers",
    "Red Talons",
    "Shadow Lords",
    "Silent Striders",
    "Silver Fangs",
    "Stargazers",
    "Uktenas",
    "Wendigos",
    "White Howlers"
]

# Garou data
RAGE_PER_AUSPICE = [1, 2, 3, 4, 5]
GNOSIS_PER_BREED = [1, 3, 5]
PER_TRIBE = {
    "Black Furies": {"willpower": 3},
    "Black Spiral Dancers": {"willpower": 3},
    "Bone Gnawers": {"willpower": 3},
    "Bunyips": {"willpower": 3},
    "Children of Gaia": {"willpower": 4},
    "Croatans": {"willpower": 3},
    "Fiannas": {"willpower": 3},
    "Gets of Fenris": {"willpower": 3},
    "Glass Walkers": {"willpower": 3},
    "Red Talons": {"willpower": 3},
    "Shadow Lords": {"willpower": 3},
    "Silent Striders": {"willpower": 3},
    "Silver Fangs": {"willpower": 3},
    "Stargazers": {"willpower": 4},
    "Uktenas": {"willpower": 3},
    "Wendigos": {"willpower": 4},
    "White Howlers": {"willpower": 3},

}

GM_SHORTCUTS = {
    'garou': [
        ['appearance', 'subterfuge'],
        ['charisma', 'performance'],

        ['dexterity', 'athletics'],
        ['dexterity', 'brawl'],
        ['dexterity', 'drive'],
        ['dexterity', 'firearms'],
        ['dexterity', 'larceny'],
        ['dexterity', 'melee'],
        ['dexterity', 'stealth'],
        ['intelligence', 'academics'],
        ['intelligence', 'medicine'],
        ['intelligence', 'rituals'],
        ['manipulation', 'empathy'],
        ['manipulation', 'subterfuge'],
        ['perception', 'empathy'],
        ['perception', 'primal-urge','R:Instinct'],
        ['stamina', 'primal-urge'],
        ['strength', 'athletics'],
        ['strength', 'brawl'],
        ['wits', 'empathy'],
        ['wits', 'enigmas'],
        ['wits', 'drive'],
        ['wits', 'survival'],
        ['wits', 'larceny'],
        ['charisma', 'subterfuge', "R:Business"],
        ['appearance', 'empathy', "R:Friendship"],
        ['intelligence', 'subterfuge', "R:Persuasion"],
        ['perception', 'alertness', "R:Sneaking"],
        ['wits', 'streetwise', 'R:Fast-talk'],

    ],
    'kinfolk': [
        ['perception', 'alertness'],
        ['perception', 'empathy'],
        ['intelligence', 'medicine'],
        ['intelligence', 'academics'],
        ['dexterity', 'brawl'],
        ['dexterity', 'firearms'],
        ['dexterity', 'athletics'],
        ['dexterity', 'larceny'],
        ['dexterity', 'drive'],
        ['dexterity', 'stealth'],
        ['strength', 'athletics'],
        ['strength', 'brawl'],
        ['wits', 'empathy'],
        ['wits', 'enigmas'],
        ['wits', 'drive'],
        ['charisma', 'performance'],
        ['charisma', 'subterfuge'],
        ['appearance', 'subterfuge'],
        ['manipulation', 'subterfuge'],
    ],
    'kindred': [
        ['dexterity', 'brawl'],
        ['dexterity', 'melee'],
        ['dexterity', 'athletics'],
        ['dexterity', 'stealth'],
        ['charisma', 'performance'],
        ['charisma', 'intimidation'],
        ['manipulation', 'subterfuge'],
        ['appearance', 'subterfuge'],
        ['perception', 'alertness'],
        ['perception', 'empathy'],
        ['perception', 'athletics'],
        ['wits', 'streetwise'],
        ['intelligence', 'finance'],
        ['intelligence', 'investigation'],
        ['strength', 'athletics'],
        ['intelligence', 'academics'],
        ['intelligence', 'medicine'],
        ['intelligence', 'politics'],
        ['wits', 'etiquette'],
        ['wits', 'awareness'],
        ['wits', 'empathy'],
        ['wits', 'politics'],
        ['wits', 'dexterity'],
    ],
    'mortal': [],
    'ghoul': [],
    'fomori': [],
    'mage': [],
    'changeling': [],
    'kithain': [],
    'wraith': [],
}

bloodpool = {
    13: 10,
    12: 11,
    11: 12,
    10: 13,
    9: 14,
    8: 15,
    7: 20,
    6: 30,
    5: 50,
    4: 70,
    3: 100,
    2: 100,
    1: 100,
}

CLANS_SPECIFICS = {
    'Assamite': {
        'disciplines': ['Celerity (1)', 'Obfuscate (1)', 'Quietus (1)'],
        'clan_weakness': 'Kindred blood addiction'
    },
    'Baali': {
        'disciplines': ['Dominate (1)', 'Obfuscate (1)', 'Potence (1)'],
        'clan_weakness': 'I do not know'
    },
    'Assamite Antitribu': {
        'disciplines': ['Celerity (1)', 'Obfuscate (1)', 'Quietus (1)'],
        'clan_weakness': 'Kindred blood addiction'
    },
    'Blood Brother': {
        'disciplines': ['Fortitude (1)', 'Potence (1)', 'Sanguinus (1)'],
        'clan_weakness': 'No Embrace'
    },
    'Brujah': {
        'disciplines': ['Celerity (1)', 'Potence (1)', 'Presence (1)'],
        'clan_weakness': 'Short fuse'
    },
    'Brujah Antitribu': {
        'disciplines': ['Celerity (1)', 'Potence (1)', 'Presence (1)'],
        'clan_weakness': 'Short fuse'
    },
    'Caitiff': {
        'disciplines': [],
        'clan_weakness': ''
    },
    'Cappadocian': {
        'disciplines': ['Auspex (1)', 'Fortitude (1)', 'Necromancy (1)'],
        'clan_weakness': 'Corpse Appeareance'
    },

    'Gangrel': {
        'disciplines': ['Animalism (1)', ' Fortitude (1)', 'Protean (1)'],
        'clan_weakness': 'Animal traits'

    },
    'Gangrel Antitribu': {
        'disciplines': ['Celerity (1)', 'Obfuscate (1)', 'Protean (1)'],
        'clan_weakness': 'Animal traits'
    },
    'Gargoyle': {
        'disciplines': ['Fortitude (1)', 'Potence (1)', 'Visceratika (1)'],
        'clan_weakness': ''
    },
    'Giovanni': {
        'disciplines': ['Dominate (1)', 'Necromancy (1)', 'Potence (1)'],
        'clan_weakness': 'Painful kiss'
    },
    'Harbinger Of Skulls': {
        'disciplines': ['Auspex (1)', 'Fortitude (1)', 'Necromancy (1)'],
        'clan_weakness': 'Corpse Appeareance'
    },
    'Kiasyd': {
        'disciplines': ['Dominate (1)', ' Mytherceria (1)', 'Obtenebration (1)'],
        'clan_weakness': 'Cold Iron Sensitive'
    },
    'Lasombra': {
        'disciplines': ['Dominate (1)', 'Obtenebration (1)', 'Potence (1)'],
        'clan_weakness': 'No reflection'
    },
    'Lasombra Antitribu': {
        'disciplines': ['Dominate (1)', 'Obtenebration (1)', 'Potence (1)'],
        'clan_weakness': 'No reflection'
    },
    'Malkavian': {
        'disciplines': ['Auspex (1)', 'Dementation (1)', 'Obfuscate (1)'],
        'clan_weakness': 'Derangement'
    },
    'Malkavian Antitribu': {
        'disciplines': ['Auspex (1)', 'Dementation (1)', 'Obfuscate (1)'],
        'clan_weakness': 'Derangement'

    },
    'Nosferatu': {
        'disciplines': ['Animalism (1)', 'Obfuscate (1)', 'Potence (1)'],
        'clan_weakness': 'Hideous Appearence'
    },
    'Nosferatu Antitribu': {
        'disciplines': ['Animalism (1)', 'Obfuscate (1)', 'Potence (1)'],
        'clan_weakness': 'Hideous Appearence'
    },
    'Panders': {
        'disciplines': [],
        'clan_weakness': ''
    },
    'Ravnos': {
        'disciplines': ['Animalism (1)', 'Chimerstry (1)', 'Fortitude (1)'],
        'clan_weakness': 'Vice addiction'
    },
    'Ravnos Antitribu': {
        'disciplines': ['Animalism (1)', 'Chimerstry (1)', 'Fortitude (1)'],
        'clan_weakness': 'Vice addiction'
    },
    'Salubri': {
        'disciplines': ['Auspex (1)', 'Fortitude (1)', 'Obeah (1)'],
        'clan_weakness': 'Must feed under passion'
    },
    'Salubri Antitribu': {
        'disciplines': ['Auspex (1)', 'Fortitude (1)', 'Valeren (1)'],
        'clan_weakness': 'Must feed under passion'
    },
    'Samedi': {
        'disciplines': ['Animalism (1)', 'Obfuscate (1)', 'Potence (1)'],
        'clan_weakness': 'Hideous Appearence'
    },
    'Setite': {
        'disciplines': ['Obfuscate (1)', 'Presence (1)', 'Serpentis (1)'],
        'clan_weakness': 'Light sensitive'
    },
    'Setite Antitribu': {
        'disciplines': ['Obfuscate (1)', 'Presence (1)', 'Serpentis (1)'],
        'clan_weakness': 'Light sensitive'
    },
    'Serpent Of The Light': {
        'disciplines': ['Obfuscate (1)', 'Presence (1)', 'Serpentis (1)'],
        'clan_weakness': 'Light sensitive'
    },
    'Toreador': {
        'disciplines': ['Auspex (1)', 'Celerity (1)', 'Presence (1)'],
        'clan_weakness': 'Fascination'
    },
    'Daughter Of Cacophony': {
        'disciplines': ['Auspex (1)', 'Celerity (1)', 'Presence (1)'],
        'clan_weakness': 'Fascination'
    },
    'Toreador Antitribu': {
        'disciplines': ['Auspex (1)', 'Celerity (1)', 'Presence (1)'],
        'clan_weakness': 'Fascination'
    },
    'Tremere': {
        'disciplines': ['Auspex (1)', 'Dominate (1)', 'Thaumaturgy (1)'],
        'clan_weakness': 'Blood thrall'
    },
    'True Brujah': {
        'disciplines': ['Temporis (1)', 'Potence (1)', 'Presence (1)'],
        'clan_weakness': 'Short fuse'
    },
    'Tzimisce': {
        'disciplines': ['Animalism (1)', 'Auspex (1)', 'Vicissitude (1)'],
        'clan_weakness': 'Earth from the grave'
    },
    'Ventrue': {
        'disciplines': ['Dominate (1)', 'Fortitude (1)', 'Presence (1)'],
        'clan_weakness': 'Prey Exclusive'
    },
    'Ventrue Antitribu': {
        'disciplines': ['Dominate (1)', 'Fortitude (1)', 'Presence (1)'],
        'clan_weakness': 'Prey Exclusive'
    }
}

ENLIGHTENMENT = {
    'Humanity': {
        'virtues': ['Conscience', 'Self-Control', 'Courage'],
        'clans': []
    },
    'Caine': {
        'virtues': ['Conviction', 'Instinct', 'Courage'],
        'clans': []
    },
    'Cathari': {
        'virtues': ['Conviction', 'Instinct', 'Courage'],
        'clans': []
    },
    'Death and the Soul': {
        'virtues': ['Conviction', 'Self-Control', 'Courage'],
        'clans': []
    },
    'Evil Revelations': {
        'virtues': ['Conviction', 'Instinct', 'Courage'],
        'clans': []
    },
    'Feral Heart': {
        'virtues': ['Conviction', 'Instinct', 'Courage'],
        'clans': []
    },
    'Honorable Accord': {
        'virtues': ['Conscience', 'Self-Control', 'Courage'],
        'clans': []
    },
    'Lilith': {
        'virtues': ['Conviction', 'Instinct', 'Courage'],
        'clans': []
    },
    'Power and the Inner Voice': {
        'virtues': ['Conviction', 'Instinct', 'Courage'],
        'clans': []
    },
    'Blood': {
        'virtues': ['Conviction', 'Self-Control', 'Courage'],
        'clans': ['Assamite']
    },
    'Bones': {
        'virtues': ['Conviction', 'Self-Control', 'Courage'],
        'clans': ['Giovanni']
    },
    'Night': {
        'virtues': ['Conviction', 'Instinct', 'Courage'],
        'clans': ['Lasombra']
    },
    'Metamorphosis': {
        'virtues': ['Conviction', 'Instinct', 'Courage'],
        'clans': ['Tzimisce']
    },
    'Paradox': {
        'virtues': ['Conviction', 'Self-Control', 'Courage'],
        'clans': ['Ravnos']
    },
    'Typhon': {
        'virtues': ['Conviction', 'Self-Control', 'Courage'],
        'clans': ['Setite']
    },
}

CLAN_COLORS = {
    'none': {
        "faction": "independents",
        "color": '#9d9d9d',
        "idx": 0,
    },

    'ventrue': {
        "faction": "camarilla",
        "color": '#1d6e1f',
        "idx": 1,
    },
    'tremere': {
        "faction": "camarilla",
        "color": '#ffa636',
        "idx": 2,
    },

    'toreador': {
        "faction": "camarilla",
        "color": '#D5B237',
        "idx": 3,
    },

    'malkavian': {
        "faction": "camarilla",
        "color": '#db66d0',
        "idx": 4,
    },
    'nosferatu': {
        "faction": "camarilla",
        "color": '#a18a60',
        "idx": 5,

    },

    'gangrel': {
        "faction": "camarilla",
        "color": '#738436',
        "idx": 6,
    },

    'brujah': {
        "faction": "camarilla",
        "color": '#25a3e6',
        "idx": 7,
    },

    'caitiff': {
        "faction": "camarilla",
        "color": '#B3D537',
        "idx": 8,
    },
    'assamite': {
        "faction": "independents",
        "color": '#2E36C5',
        "idx": 9,
    },
    'assamite antitribu': {
        "faction": "sabbat",
        "color": '#2E36C5',
        "idx": 10,
    },
    'brujah antitribu': {
        "faction": "sabbat",
        "color": '#25a3e6',
        "idx": 11,
    },

    'giovanni': {
        "faction": "independents",
        "color": '#2F1984',
        "idx": 12,
    },
    'ravnos': {
        "faction": "independents",
        "color": '#5F42D0',
        "idx": 13,
    },
    'setite': {
        "faction": "independents",
        "color": '#8C78D9',
        "idx": 14,
    },
    'tzimisce antitribu': {
        "faction": "independents",
        "color": '#127B65',
        "idx": 15,
    },
    'gangrel antitribu': {
        "faction": "sabbat",
        "color": '#738436',
        "idx": 16,
    },
    'giovanni antitribu': {
        "faction": "sabbat",
        "color": '#2F1984',
        "idx": 17,
    },
    'malkavian antitribu': {
        "faction": "sabbat",
        "color": '#db66d0',
        "idx": 18,
    },
    'nosferatu antitribu': {
        "faction": "sabbat",
        "color": '#a18a60',
        "idx": 19,
    },
    'lasombra': {
        "faction": "sabbat",
        "color": '#F0F0F0',
        "idx": 20,
    },
    'lasombra antitribu': {
        "faction": "camarilla",
        "color": '#F0F0F0',
        "idx": 21,
    },
    'setite antitribu': {
        "faction": "sabbat",
        "color": '#8C78D9',
        "idx": 22,
    },
    'toreador antitribu': {
        "faction": "sabbat",
        "color": '#D5B237',
        "idx": 23,
    },
    'tremere antitribu': {
        "faction": "sabbat",
        "color": '#ffa636',
        "idx": 24,
    },
    'ravnos antitribu': {
        "faction": "sabbat",
        "color": '#5F42D0',
        "idx": 25,

    },
    'pander': {
        "faction": "sabbat",
        "color": '#808080',
        "idx": 26,
    },
    'tzimisce': {
        "faction": "sabbat",
        "color": '#127B65',
        "idx": 27,
    },
    'ventrue antitribu': {
        "faction": "sabbat",
        "color": '#1d6e1f',
        "idx": 28,
    },
    'blood brother': {
        "faction": "sabbat",
        "color": '#8f6265',
        "idx": 29,
    },
}
