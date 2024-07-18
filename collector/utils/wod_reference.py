from collector.models.chronicles import Chronicle
import logging

logger = logging.Logger(__name__)


def get_current_chronicle():
    # When migrating
    #return None
    ch = None
    try:
        current_chronicle = Chronicle.objects.filter(is_current=True).first()
        ch = current_chronicle
    except:
        first_chronicle = Chronicle.objects.first()
        first_chronicle.is_current = True
        first_chronicle.is_storyteller_only = True
        first_chronicle.save()
        ch = first_chronicle
        print(f"Error with get_chronicle {ch}")
    return ch


def set_chronicle(acro):
    for c in Chronicle.objects.all():
        if c.acronym == acro:
            c.is_current = True
        else:
            c.is_current = False
        c.save()
    c = get_current_chronicle()
    print(f'Current Chronicle set to is {c.acronym}.')


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
                        'title', 'treasures']
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
                        'resources', 'status', 'true faith']
    },

    'garou': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'primal-urge',
                    'streetwise', 'subterfuge'],
        'skills': ['animal ken', 'crafts', 'drive', 'etiquette', 'firearms', 'leadership', 'melee', 'performance',
                   'stealth', 'survival'],
        'knowledges': ['computer', 'enigmas', 'investigation', 'law', 'linguistics', 'medicine', 'occult', 'politics',
                       'rituals', 'science'],
        'backgrounds': ['allies', 'ancestors', 'contacts', 'fetish', 'kinfolk', 'mentor', 'pure breed', 'resources',
                        'rites', 'totem']
    },
    'ghoul': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'intuition',
                    'streetwise', 'subterfuge'],
        'skills': ['animal ken', 'crafts', 'drive', 'etiquette', 'firearms', 'leadership', 'melee', 'performance',
                   'stealth', 'survival'],
        'knowledges': ['academics', 'technology', 'finance', 'investigation', 'law', 'linguistics', 'medicine',
                       'occult', 'politics', 'science'],
        'backgrounds': ['allies', 'bond', 'contacts', 'fame', 'equipment', 'influence', 'innovation',
                        'resources', 'status', 'trust']
    },
    'kindred': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'leadership',
                    'streetwise', 'subterfuge'],
        'skills': ['animal ken', 'crafts', 'drive', 'etiquette', 'firearms', 'melee', 'performance', 'security',
                   'stealth', 'survival'],
        'knowledges': ['academics', 'technology', 'finance', 'investigation', 'law', 'linguistics', 'medicine',
                       'occult',
                       'politics',
                       'science'],
        'backgrounds': ['allies', 'contacts', 'fame', 'generation', 'herd', 'influence', 'mentor',
                        'resources', 'retainers', 'status']
    },
    'kinfolk': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'intuition',
                    'streetwise', 'subterfuge'],
        'skills': ['animal ken', 'crafts', 'drive', 'etiquette', 'firearms', 'leadership', 'melee', 'performance',
                   'stealth', 'survival'],
        'knowledges': ['academics', 'computer', 'enigmas', 'investigation', 'law', 'linguistics', 'medicine',
                       'occult', 'politics', 'science'],
        'backgrounds': ['allies', 'ancestors', 'contacts', 'equipment', 'favors', 'pure-breed', 'renown', 'resources',
                        'status', 'true faith']
    },
    'mage': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'awareness', 'brawl', 'dodge', 'expression', 'intimidation', 'leadership',
                    'streetwise', 'subterfuge'],
        'skills': ['crafts', 'drive', 'etiquette', 'firearms', 'meditation', 'melee', 'performance',
                   'stealth', 'survival', 'technology'],
        'knowledges': ['academics', 'computer', 'cosmology', 'enigmas', 'investigation', 'law', 'linguistics',
                       'medicine', 'occult', 'science'],
        'backgrounds': ['allies', 'arcane', 'avatar', 'contacts', 'destiny', 'dream', 'influence', 'library', 'node',
                        'resources', 'wonder']
    },
    'mortal': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'intuition',
                    'streetwise', 'subterfuge'],
        'skills': ['animal ken', 'crafts', 'drive', 'etiquette', 'firearms', 'leadership', 'melee', 'performance',
                   'stealth', 'survival'],
        'knowledges': ['academics', 'computer', 'enigmas', 'investigation', 'law', 'linguistics', 'medicine',
                       'occult', 'politics', 'science'],
        'backgrounds': ['allies', 'career', 'contacts', 'fame', 'family', 'equipment', 'influence',
                        'resources', 'status', 'true faith']
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
                        'resources', 'wonder']
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
                        'status', 'wealth']
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
        'abilities': '11/7/5',
        'disciplines': '1',
        'backgrounds': '7',
        'willpower': '3',
        'freebies': '21'
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
        'abilities': '11/7/5',
        'disciplines': '1',
        'backgrounds': '7',
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
        'disciplines': '1',
        'backgrounds': '7',
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

RANKS = ['Cliath', 'Fostern', 'Adren', 'Athro', 'Elder']

FONTSET = ['Cinzel', 'Trade+Winds', 'Imprima', 'Roboto', 'Philosopher', 'Ruda', 'Khand', 'Allura', 'Gochi+Hand',
           'Reggae+One', 'Syne+Mono', 'Zilla+Slab', 'Spartan', 'Marcellus+SC', 'Splash', 'Trirong']

CHARACTERS_PER_PAGE = 20

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
    "Wendigos"
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
    "Stargazers": {"willpower": 5},
    "Uktenas": {"willpower": 3},
    "Wendigos": {"willpower": 4},

}

GM_SHORTCUTS = {
    'garou': [
        ['perception', 'alertness'],
        ['perception', 'primal-urge'],
        ['dexterity', 'brawl'],
        ['stamina', 'primal-urge'],
        ['wits', 'enigmas'],
        ['appearance', 'subterfuge']
    ],
    'kindred': [
        ['dexterity', 'stealth'],
        ['dexterity', 'dodge'],
        ['charisma', 'performance'],
        ['charisma', 'intimidation'],
        ['manipulation', 'subterfuge'],
        ['appearance', 'subterfuge'],
        ['perception', 'alertness'],
        ['perception', 'empathy'],
        ['perception', 'dodge'],
        ['wits', 'streetwise'],
        ['strength', 'athletics'],
        ['intelligence', 'academics'],
        ['wits', 'etiquette'],
    ],
    'mortal': [],
    'kinfolk': [],
    'ghoul': [],
    'fomori': [],
    'mage': [],
    'changeling': [],
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
