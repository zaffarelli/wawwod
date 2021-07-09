from collector.models.creatures import Creature
import json
import logging
from django.conf import settings
from collector.utils.wod_reference import get_current_chronicle
from collector.utils.helper import toRID

chronicle = get_current_chronicle()
logger = logging.Logger(__name__)


# def cleanup_spare_unknown():
#     action = 0
#     logger.debug("=> Removing 'Unknown...' without infans")
#     all = Creature.objects.filter(creature='kindred', name__contains='Unknown')
#     for kindred in all:
#         infans = Creature.objects.filter(sire=kindred.name)
#         if infans is None:
#             logger.debug(" --> Deleting [%s]: No infans." % (kindred.name))
#             kindred.delete()
#             action += 1
#         if kindred.background3 >= 10:
#             logger.debug(" --> Deleting [%s]: Generation is too low" % (kindred.name))
#             kindred.delete()
#             action += 1
#     return action


# def cleanup_false_unknown_reference():
#     action = 0
#     logger.info("=> Removing 'Unknown...' sire if they don't exist")
#     all = Creature.objects.filter(creature='kindred', sire__contains='Unknown')
#     for kindred in all:
#         sire = Creature.objects.filter(name=kindred.sire).first()
#         if sire is None:
#             logger.info(" --> No sire [%s] found for [%s]: Updating kindred." % (kindred.sire, kindred.name))
#             kindred.sire = ''
#             kindred.save()
#             action += 1
#     return action


# def create_named_sires():
#     action = 0
#     logger.info("=> Creating Sires")
#     all = Creature.objects.filter(creature='kindred').exclude(sire='').exclude(background3__gte=8)
#     for kindred in all:
#         sire = Creature.objects.filter(creature='kindred', name=kindred.sire).first()
#         if sire is None:
#             embracer = Creature()
#             embracer.background3 = kindred.background3 + 1
#             embracer.family = kindred.family
#             embracer.name = kindred.sire
#             embracer.ghost = True
#             embracer.save()
#             logger.info(" --> Sire [%s] created for [%s]" % (embracer.name, kindred.name))
#             action += 1
#     return action


# def create_sires():
#     action = 0
#     logger.info("=> Siring 'Unknown...'")
#     all_sireless = Creature.objects.filter(creature='kindred', sire='', background3__lte=7)
#     ghost_sires = {}
#     for kindred in all_sireless:
#         str = "Unknown %dth generation %s" % (13 - (kindred.background3 + 1), kindred.root_family())
#         grandsire = "Unknown %dth generation %s" % (13 - (kindred.background3 + 2), kindred.root_family())
#         if kindred.background3 + 2 == 10:
#             if kindred.root_family() in ['Toreador', 'Daughter of Cacophony']:
#                 grandsire = 'Arikel'
#             elif kindred.root_family() == 'Malkavian':
#                 grandsire = 'Malkav'
#             elif kindred.root_family() == 'Salubri':
#                 grandsire = 'Saulot'
#             elif kindred.root_family() == 'Gangrel':
#                 grandsire = 'Ennoia'
#             elif kindred.root_family() == 'Ventrue':
#                 grandsire = 'Ventru'
#             elif kindred.root_family() == 'Cappadocian':
#                 grandsire = 'Cappadocius'
#             elif kindred.root_family() == 'Nosferatu':
#                 grandsire = 'Absimiliard'
#             elif kindred.root_family() == 'Ravnos':
#                 grandsire = 'Dracian'
#             elif kindred.root_family() == 'Setite':
#                 grandsire = 'Set'
#             elif kindred.root_family() == 'Assamite':
#                 grandsire = 'Haqim'
#             elif kindred.root_family() in ['Lasombra', 'Kiasyd']:
#                 grandsire = 'Lasombra'
#             elif kindred.root_family() == 'Tzimisce':
#                 grandsire = 'The Eldest'
#             elif kindred.root_family() == 'Brujah':
#                 grandsire = 'Brujah'
#         elif kindred.background3 + 2 == 9:
#             if kindred.root_family() == 'Giovanni':
#                 grandsire = 'Augustus Giovanni'
#             elif kindred.root_family() == 'Tremere':
#                 grandsire = 'Tremere'
#             elif kindred.root_family() == 'Brujah':
#                 grandsire = 'Troile'
#         j = {"ghost": True, "family": kindred.root_family(), "background3": kindred.background3 + 1, "name": str,
#              "sire": grandsire}
#         ghost_sires[str] = j
#         kindred.sire = str
#         kindred.save()
#         action += 1
#     logger.info("=> Kindred sires to be created")
#     logger.info(json.dumps(ghost_sires, indent=2))
#     logger.info("=> Creating Linked Ghosts")
#     for key in ghost_sires:
#         gs = ghost_sires[key]
#         logger.info(" ----> Dealing with ghost %s" % (gs['name']))
#         f = Creature.objects.filter(name=gs['name']).first()
#         if f is None:
#             t = Creature()
#             t.name = gs['name']
#             t.background3 = gs['background3']
#             t.family = gs['family']
#             t.ghost = gs['ghost']
#             t.sire = gs['sire']
#             t.save()
#             logger.info(" --> Adding ghost %s" % (t.name))
#             action += 1
#     return action


# def check_caine_roots():
#     action = 1
#     while action > 0:
#         action = cleanup_spare_unknown()
#         action = cleanup_false_unknown_reference()
#         action = create_named_sires()
#         action = create_sires()
#         logger.info("Number of actions executed: %d" % (action))
#     x = Creature.objects.filter(creature='kindred', name="Caine").first()
#     data = x.find_lineage()
#     with open(f'{settings.STATICFILES_DIRS}/js/kindred.json', 'w') as fp:
#         json.dump(data, fp)
#     logger.info("--> Lineage Done")
#     return {'responseText': 'Ok'}


def blank_str(name, gen, sire, clan=''):
    root_family = clan.replace(' Antitribu', '')
    x = {
        'name': name,
        'clan': clan,
        'family': root_family,
        'sire': sire,
        'condition': 'OK',
        'status': 'OK',
         'generation': gen,
        'ghost': True,
        'mythic': False,
        'faction': '',
        'children': [],
        'ghouls': '',
        'rid': toRID(name),
        'id': 0,
        'key': 0
         }
    return x


def create_mythics():
    generations = {
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': [],
        '9': [],
        '10': [],
        '11': [],
        '12': [],
        '13': [],
    }
    kindred_stack = []
    kindred_stack.append(blank_str('Caine', 1, ""))
    kindred_stack.append(blank_str('Enoch', 2, "_caine"))
    kindred_stack.append(blank_str('Irad', 2, "_caine"))
    kindred_stack.append(blank_str('Zillah', 2, "_caine"))
    kindred_stack.append(blank_str('The Crone', 2, "_caine"))
    kindred_stack.append(blank_str('Lilith', 2, "_caine"))
    kindred_stack.append(blank_str('Arikel', 3, "_enoch", 'Toreador'))
    kindred_stack.append(blank_str('Malkav', 3, "_enoch", 'Malkavian'))
    kindred_stack.append(blank_str('Saulot', 3, "_enoch", 'Salubri'))
    kindred_stack.append(blank_str('Ventru', 3, "_irad", 'Ventrue'))
    kindred_stack.append(blank_str('Brujah', 3, "_irad", 'True Brujah'))
    kindred_stack.append(blank_str('Cappadocius', 3, "_irad", 'Cappadocian'))
    kindred_stack.append(blank_str('Lasombra', 3, "_irad", 'Lasombra'))
    kindred_stack.append(blank_str('Ennoia', 3, "_lilith", 'Gangrel'))
    kindred_stack.append(blank_str('Ravnos', 3, "_the_crone", 'Ravnos'))
    kindred_stack.append(blank_str('The Elder One', 3, "_the_crone", 'Tzimisce'))
    kindred_stack.append(blank_str('Absimilard', 3, "_zillah", 'Nosferatu'))
    kindred_stack.append(blank_str('Set', 3, "_zillah", 'Setite'))
    kindred_stack.append(blank_str('Haqim', 3, "_zillah", 'Assamite'))
    kindred_stack.append(blank_str('Troile', 4, "_brujah", 'Brujah'))
    kindred_stack.append(blank_str('Augustus Giovanni', 4, "_cappadocius", 'Giovanni'))
    kindred_stack.append(blank_str('Tremere', 4, "_saulot", 'Tremere'))

    kindred_stack.append(blank_str('Outcast', 5, "_troile", 'Caitiff'))
    kindred_stack.append(blank_str('Pander', 6, "_outcast", 'Panders'))
    kindred_stack.append(blank_str('Caitiff', 6, "_outcast", 'Caitiff'))
    kindred_stack.append(blank_str('Blood Brother', 6, "_outcast", 'Blood Brothers'))
    kindred_stack.append(blank_str('Gargoyle', 6, "_outcast", 'Gargoyle'))
    kindred_stack.append(blank_str('Samedi', 6, "_outcast", 'Samedi'))
    kindred_stack.append(blank_str('Baali', 6, "_outcast", 'Baali'))

    for k in kindred_stack:
        k['mythic'] = True
        generations[f'{k["generation"]}'].append(k)
    return generations


def improvise_id():
    import random
    sequence = 'abcdefghijklmnoprstuvwxyz '
    s = ''
    for _ in range(10):
        s += random.choice(sequence)
    return s.title()


def build_per_primogen(param=None):
    chronicle = get_current_chronicle()
    cainites = create_mythics()
    if param is None:
        kindreds = Creature.objects.filter(creature='kindred', ghost=False, mythic=False,
                                           chronicle=chronicle.acronym).order_by('-trueage','family')
    else:
        kindreds = Creature.objects.filter(creature='kindred', faction=param, ghost=False, mythic=False,
                                           chronicle=chronicle.acronym).order_by('-trueage','family')
    # Improvise empty sires
    for kindred in kindreds:
        gen = 13 - kindred.value_of('generation')
        k = kindred.json_str()
        if kindred.sire == '':
            k['sire'] = f'temporary-{improvise_id()}-{gen - 1}-{k["name"]}-{k["family"]}'
        else:
            k['sire'] = kindred.sire
        cainites[f'{gen}'].append(k)

    # Try to fill empty lineages
    for gen in range(13, 0, -1):
        for k in cainites[f'{gen}']:
            if gen > 1: # Caine has no sire
                if k['sire'].startswith('temporary-'):
                    sire = None
                    for item in cainites[f'{gen - 1}']:
                        if item.get('sire') == k['sire']:
                            sire = item
                    if sire is None:
                        words = k["sire"].split('-')
                        sire = blank_str(words[1], words[2], "TBD", words[4])
                        sire['children'].append(k)
                        k['sire'] = sire['name']
                        cainites[f'{gen - 1}'].append(sire)
                else:
                    if k["sire"] == "TBD":
                        # We need here to find a matching sire according to clan
                        found = None
                        for s in cainites[f'{gen - 1}']:
                            if s["family"] == k["family"]:
                                k["sire"] = s['rid']
                                s["children"].append(k)
                                found = s
                                break
                        if found is None:
                            sire = blank_str(improvise_id(), gen - 1, "TBD", k['clan'])
                            sire['children'].append(k)
                            k['sire'] = sire['rid']
                            cainites[f'{gen - 1}'].append(sire)
                    else:
                        sire = None
                        for item in cainites[f'{gen - 1}']:
                            if item['rid'] == k["sire"]:
                                sire = item
                                sire['children'].append(k)
                        if sire is None:
                            sire = blank_str(k['sire'], gen - 1, "TBD", k['clan'])
                            sire['children'].append(k)
                            k['sire'] = sire['rid']
                            cainites[f'{gen - 1}'].append(sire)
    str = json.dumps(cainites['1'], indent=4, sort_keys=False)
    print(str)
    return str


def domitor_from_sire():
    kindreds = Creature.objects.filter(chronicle=chronicle.acronym)
    for k in kindreds:
        if k.sire != '':
            sires = Creature.objects.filter(name=k.sire)
            if len(sires) == 1:
                s = sires.first()
            else:
                s = None
            if s is not None:
                k.domitor = s
                k.save()


def build_gaia_wheel():
    chronicle = get_current_chronicle()
    creatures = Creature.objects.filter(chronicle=chronicle.acronym).exclude(mythic=True).exclude(
        condition="DEAD").exclude(ghost=True).order_by(
        '-faction', 'display_pole')
    for creature in creatures:
        creature.need_fix = True
        creature.save()
    wyrm_list = []
    weaver_list = []
    wyld_list = []
    sabbat_list = []
    pentex_list = []
    traditions_list = []
    kith_list = []
    underworld_list = []

    for c in creatures:
        creature_dict = c.toDict
        if (c.faction == 'Camarilla') or (c.faction == 'Independant') or (
                c.faction == 'Anarchs') or (
                c.faction == 'Inconnu'):
            wyrm_list.append(creature_dict)
        elif (c.faction == 'Sabbat'):
            sabbat_list.append(creature_dict)
        elif (c.faction == 'Pentex'):
            pentex_list.append(creature_dict)
        elif (c.faction == 'Gaia'):
            wyld_list.append(creature_dict)
        elif (c.creature == 'mage'):
            traditions_list.append(creature_dict)
        elif (c.creature == 'changeling'):
            kith_list.append(creature_dict)
        elif (c.creature == 'wraith'):
            underworld_list.append(creature_dict)

        else:
            weaver_list.append(creature_dict)
    d3js_data = {
        'lists': [
            {'name': 'humans', 'index': 0, 'color': '#28F', 'value': 4, 'start': 0, 'font': 'Roboto',
             'collection': weaver_list},
            {'name': 'camarilla', 'index': 0, 'color': '#2A2', 'value': 5, 'start': 0, 'font': 'Cinzel',
             'collection': wyrm_list},
            {'name': 'sabbat', 'index': 0, 'color': '#E66', 'value': 2, 'start': 0, 'font': 'Roboto',
             'collection': sabbat_list},
            {'name': 'kith', 'index': 0, 'color': '#FC8', 'value': 1, 'start': 0, 'font': 'Allura',
             'collection': kith_list},
            {'name': 'garou', 'index': 0, 'color': '#A82', 'value': 8, 'start': 0, 'font': 'Trade Winds',
             'collection': wyld_list},
            {'name': 'traditions', 'index': 0, 'color': '#828', 'value': 1, 'start': 0, 'font': 'Allura',
             'collection': traditions_list},
            {'name': 'underworld', 'index': 0, 'color': '#447', 'value': 1, 'start': 0, 'font': 'Khand',
             'collection': underworld_list},
            {'name': 'pentex', 'index': 0, 'color': '#25A', 'value': 2, 'start': 0, 'font': 'Ruda',
             'collection': pentex_list},
        ]
    }
    idx = 0
    cumul = 0
    for list in d3js_data['lists']:
        list['index'] = idx
        idx += 1
        list['start'] = cumul
        cumul += list['value']

    all = json.dumps(d3js_data, indent=4, sort_keys=False)
    return all
