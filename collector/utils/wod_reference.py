from collector.models.chronicles import Chronicle
import logging

logger = logging.Logger(__name__)


def get_current_chronicle():
    ch = None
    try:
        current_chronicle = Chronicle.objects.filter(is_current=True).first()
        ch = current_chronicle
    except:
        first_chronicle = Chronicle.objects.first()
        first_chronicle.is_current = True
        first_chronicle.save()
        ch = first_chronicle
    return ch


def set_chronicle(acro):
    for c in Chronicle.objects.all():
        if c.acronym == acro:
            c.is_current = True
            logger.debug(f'Current Chronicle set to is {c.acronym}.')
        else:
            c.is_current = False
        c.save()


def find_stat_property(creature, statistic):
    # You give 'kindred' / 'generation', it returns 'background3'
    lists = ['attributes', 'talents', 'skills', 'knowledges', 'backgrounds']
    property = 'n/a'
    for list in lists:
        if statistic in STATS_NAMES[creature][list]:
            property = f'{list[:-1]}{STATS_NAMES[creature][list].index(statistic)}'
            logger.debug(f'Parsing --> {property}')
            break
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
        'backgrounds': ['allies', 'ancestors', 'contacts', 'fetish', 'kinfolk', 'mentor', 'pure-breed', 'resources',
                        'rites', 'totem']
    },
    'ghoul': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'intuition',
                    'streetwise', 'subterfuge'],
        'skills': ['animal ken', 'crafts', 'drive', 'etiquette', 'firearms', 'leadership', 'melee', 'performance',
                   'stealth', 'survival'],
        'knowledges': ['academics', 'computer', 'finance', 'investigation', 'law', 'linguistics', 'medicine',
                       'occult', 'politics', 'science'],
        'backgrounds': ['allies', 'bond', 'contacts', 'fame', 'equipment', 'influence', 'mentor',
                        'resources', 'status', 'trust']
    },
    'kindred': {
        'attributes': ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception',
                       'intelligence', 'wits'],
        'talents': ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'leadership',
                    'streetwise', 'subterfuge'],
        'skills': ['animal ken', 'crafts', 'drive', 'etiquette', 'firearms', 'melee', 'performance', 'security',
                   'stealth', 'survival'],
        'knowledges': ['academics', 'computer', 'finance', 'investigation', 'law', 'linguistics', 'medicine', 'occult',
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
    'mage': {
        'attributes': '7/5/3',
        'abilities': '13/9/5',
        'traits': '5',
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

AUSPICES = ['Ragabasch', 'Theurge', 'Philodox', 'Galliard', 'Ahroun']

RANKS = ['Cliath', 'Fostern', 'Adren', 'Athro', 'Elder']

FONTSET = ['Cinzel', 'Trade+Winds', 'Imprima', 'Roboto', 'Philosopher', 'Ruda', 'Khand', 'Allura', 'Gochi+Hand',
           'Reggae+One', 'Syne+Mono', 'Zilla+Slab', 'Spartan']

GM_SHORTCUTS = {
    'garou': [
        ['perception', 'alertness'],
        ['perception', 'primal-urge'],
        ['dexterity', 'brawl'],
        ['stamina', 'primal-urge'],
        ['wits', 'enigmas'],
        ['appearance', 'subterfuge']
    ],
    'kindred': [],
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
    'Harbinger of Skulls': {
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
    'Salubri Antitribu': {
        'disciplines': ['Auspex (1)', 'Fortitude (1)', 'Valeren (1)'],
        'clan_weakness': 'Must feed under passion'
    },
    'Setite': {
        'disciplines': ['Obfuscate (1)', 'Presence (1)', 'Serpentis (1)'],
        'clan_weakness': 'Light sensitive'
    },
    'Setite Antitribu': {
        'disciplines': ['Obfuscate (1)', 'Presence (1)', 'Serpentis (1)'],
        'clan_weakness': 'Light sensitive'
    },
    'Toreador': {
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
