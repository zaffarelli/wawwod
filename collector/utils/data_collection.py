from collector.models.creatures import Creature
import json
import logging
from django.conf import settings
from collector.utils.wod_reference import get_current_chronicle, FONTSET
from collector.utils.helper import toRID
from collector.utils.kindred_stuff import resort

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
        'primogen': False,
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
    kindred_stack.append(blank_str('Teram', 4, "_cappadocius", 'Harbinger Of Skulls'))
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
        kindreds = Creature.objects.filter(creature='kindred', ghost=False, mythic=False, hidden=False, chronicle=chronicle.acronym).order_by('-trueage', 'family')
    else:
        kindreds = Creature.objects.filter(creature='kindred', faction=param.title(), ghost=False, mythic=False, hidden=False,chronicle=chronicle.acronym).order_by('-trueage', 'family')
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
            if gen > 1:  # Caine has no sire
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
    # print(str)
    return str


CAM_CLANS = ['Brujah', 'Gangrel', 'Malkavian', 'Nosferatu', 'Toreador', 'Tremere', 'Ventrue']


def build_gaia_wheel():
    chronicle = get_current_chronicle()
    creatures = Creature.objects.filter(chronicle=chronicle.acronym) \
        .exclude(mythic=True) \
        .exclude(condition__startswith="DEAD=19") \
        .exclude(condition__startswith="MISSING=19") \
        .exclude(ghost=True) \
        .exclude(hidden=True) \
        .order_by('display_pole')
    # for creature in creatures:
    #     creature.need_fix = True
    #     creature.save()
    wyrm_list = []
    weaver_list = []
    wyld_list = []
    sabbat_list = []
    pentex_list = []
    traditions_list = []
    kith_list = []
    inde_list = []
    underworld_list = []
    stats = {'status': [
        {'label': 'Status 0', 'value': 0}, {'label': 'Status 1', 'value': 0}, {'label': 'Status 2', 'value': 0},
        {'label': 'Status 3', 'value': 0}, {'label': 'Status 4', 'value': 0}, {'label': 'Status 5', 'value': 0},
        {'label': 'Status 6', 'value': 0}, {'label': 'Status 7', 'value': 0}, {'label': 'Status 8', 'value': 0},
        {'label': 'Status 9', 'value': 0}, {'label': 'Status 10', 'value': 0},
        ],
        'generation': [
            {'label': '13', 'value': 0},
            {'label': '12', 'value': 0},
            {'label': '11', 'value': 0},
            {'label': '10', 'value': 0},
            {'label': '9', 'value': 0},
            {'label': '8', 'value': 0},
            {'label': '7', 'value': 0},
            {'label': '6', 'value': 0},
            {'label': '5', 'value': 0},
        ],
        'sect': [
            {'label': 'camarilla', 'value': 0}, {'label': 'independents', 'value': 0}, {'label': 'sabbat', 'value': 0}
        ],
        'balanced': [
            {'label': 'OK', 'value': 0},
            {'label': 'OK+', 'value': 0},
            {'label': 'UNB', 'value': 0}
        ],
        'creatures': [
            {'label': 'Camarilla kindreds', 'value': 0},
            {'label': 'Sabbat kindreds', 'value': 0},
            {'label': 'Lupines', 'value': 0},
            {'label': 'Camarilla Ghouls', 'value': 0}
        ],
        'clans': [],
        'disciplines': [
            {'label': '++', 'value': 0},
            {'label': '30', 'value': 0},
            {'label': '20', 'value': 0},
            {'label': '15', 'value': 0},
            {'label': '10', 'value': 0},
            {'label': '7', 'value': 0},
            {'label': '5', 'value': 0},
            {'label': '3', 'value': 0},
            {'label': '--', 'value': 0}
        ]
    }
    for x in CAM_CLANS:
        stats['clans'].append({'label': x, 'value': 0})
    total = 0
    for c in creatures:
        creature_dict = c.toDict
        if (c.faction == 'Camarilla') or (
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
        if (c.faction == 'Independents'):
            inde_list.append(creature_dict)
        else:
            if (c.creature == 'mortal'):
                weaver_list.append(creature_dict)
        total += 1
        if c.creature == "kindred" and c.faction == 'Camarilla':
            stats['status'][c.background9]['value'] += 1
            stats['generation'][c.background3]['value'] += 1

        if c.status == "OK" or c.status == "READY":
            stats['balanced'][0]['value'] += 1
        elif c.status == "OK+":
            stats['balanced'][1]['value'] += 1
        else:
            stats['balanced'][2]['value'] += 1
        if c.creature == "ghoul" and c.faction == 'Camarilla':
            stats['creatures'][3]['value'] += 1
        elif c.creature == "garou":
            stats['creatures'][2]['value'] += 1
        elif c.creature == "kindred" and c.faction.lower() == 'camarilla':
            stats['sect'][0]['value'] += 1
            stats['creatures'][0]['value'] += 1
            if c.family in CAM_CLANS:
                stats['clans'][CAM_CLANS.index(c.family)]['value'] += 1
            if c.total_traits > 40:
                stats['disciplines'][0]['value'] += 1
            elif c.total_traits > 30:
                stats['disciplines'][1]['value'] += 1
            elif c.total_traits > 20:
                stats['disciplines'][2]['value'] += 1
            elif c.total_traits > 15:
                stats['disciplines'][3]['value'] += 1
            elif c.total_traits > 10:
                stats['disciplines'][4]['value'] += 1
            elif c.total_traits > 7:
                stats['disciplines'][5]['value'] += 1
            elif c.total_traits > 5:
                stats['disciplines'][6]['value'] += 1
            elif c.total_traits > 3:
                stats['disciplines'][7]['value'] += 1
            else:
                stats['disciplines'][8]['value'] += 1
        elif c.creature == "kindred" and c.faction.lower() == 'independents':
            stats['sect'][1]['value'] += 1
        elif c.creature == "kindred" and c.faction.lower() == 'sabbat':
            stats['sect'][2]['value'] += 1
            stats['creatures'][1]['value'] += 1

    for list in [weaver_list, inde_list, underworld_list, traditions_list, pentex_list, sabbat_list, wyrm_list,
                 underworld_list,
                 wyld_list]:
        icnt = 0
        for item in list:
            item['index'] = icnt
            icnt += 1

    wyrm_list = resort(wyrm_list)
    inde_list = resort(inde_list)
    sabbat_list = resort(sabbat_list)
    # w = [f"[{item['display_pole']:30}:{item['index']:3}:{item['group']:25}]  {item['name']}" for item in wyrm_list]
    # print("\n".join(w))

    d3js_data = {
        'lists': [
            {'name': 'humans', 'index': 0, 'color': '#28F', 'value': len(weaver_list), 'start': 0, 'font': 'Roboto',
             'collection': weaver_list, 'total': total},
            {'name': 'independents', 'index': 0, 'color': '#288', 'value': len(inde_list), 'start': 0, 'font': 'Roboto',
             'collection': inde_list, 'total': total},
            {'name': 'camarilla', 'index': 0, 'color': '#2A2', 'value': len(wyrm_list), 'start': 0, 'font': 'Cinzel',
             'collection': wyrm_list, 'total': total},
            {'name': 'sabbat', 'index': 0, 'color': '#E66', 'value': len(sabbat_list), 'start': 0, 'font': 'Roboto',
             'collection': sabbat_list, 'total': total},
            {'name': 'kith', 'index': 0, 'color': '#FC8', 'value': len(kith_list), 'start': 0, 'font': 'Allura',
             'collection': kith_list, 'total': total},
            {'name': 'garou', 'index': 0, 'color': '#A82', 'value': len(wyld_list), 'start': 0, 'font': 'Trade Winds',
             'collection': wyld_list, 'total': total},
            {'name': 'traditions', 'index': 0, 'color': '#828', 'value': len(traditions_list), 'start': 0,
             'font': 'Allura',
             'collection': traditions_list, 'total': total},
            {'name': 'underworld', 'index': 0, 'color': '#447', 'value': len(underworld_list), 'start': 0,
             'font': 'Khand',
             'collection': underworld_list, 'total': total},
            {'name': 'pentex', 'index': 0, 'color': '#25A', 'value': len(pentex_list), 'start': 0, 'font': 'Ruda',
             'collection': pentex_list, 'total': total},
        ],
        'stats': stats
    }
    idx = 0
    cumul = 0
    for list in d3js_data['lists']:
        list['index'] = idx
        idx += 1
        list['start'] = cumul
        cumul += list['value']
    d3js_data['cumul'] = cumul

    all = json.dumps(d3js_data, indent=4, sort_keys=False)
    # print(all)
    return all


malkavian = "#602010"
ventrue = "#A02010"
toreador = "#904010"
tremere = "#806020"
nosferatu = "#602040"
brujah = "#203060"
gangrel = "#206090"
noone = "#808080"

MUNICH_DISTRICTS = {
    'MU001': {'name': 'Old Town & Lehel', 'description': '', 'clan': ventrue, 'sectors': 6},
    'MU002': {'name': 'Ludwigvorstadt and Isarvorstadt', 'description': '', 'clan': toreador, 'sectors': 8},
    'MU0d03': {'name': 'Maxvorstadt', 'description': '', 'clan': ventrue, 'sectors': 9},
    'MU004': {'name': 'Schwabing West', 'description': '', 'clan': ventrue, 'sectors': 3},
    'MU005': {'name': 'Au-Haidhausen', 'description': '', 'clan': malkavian, 'sectors': 6},
    'MU006': {'name': 'Sendling', 'description': '', 'clan': ventrue, 'sectors': 2},
    'MU007': {'name': 'Sendling – Westpark', 'description': '', 'clan': gangrel, 'sectors': 3},
    'MU008': {'name': 'Schwanthalerhöhe', 'description': '', 'clan': toreador, 'sectors': 2},
    'MU009': {'name': 'Neuhausen Nymphenburg', 'description': '', 'clan': toreador, 'sectors': 6},
    'MU010': {'name': 'Moosach', 'description': '', 'clan': tremere, 'sectors': 2},
    'MU011': {'name': 'Milbertshofen und Am Hart', 'description': '', 'clan': brujah, 'sectors': 3},
    'MU012': {'name': 'Schwabing-Freimann', 'description': '', 'clan': brujah, 'sectors': 8},
    'MU013': {'name': 'Bogenhausen', 'description': '', 'clan': ventrue, 'sectors': 7},
    'MU014': {'name': 'Berg am Laim', 'description': '', 'clan': nosferatu, 'sectors': 1},
    'MU015': {'name': 'Trudering – Riem', 'description': '', 'clan': ventrue, 'sectors': 4},
    'MU016': {'name': 'Ramersdorf und Perlach', 'description': '', 'clan': nosferatu, 'sectors': 5},
    'MU017': {'name': 'Obergiesing', 'description': '', 'clan': tremere, 'sectors': 2},
    'MU018': {'name': 'Untergiesing und Harlaching', 'description': '', 'clan': gangrel, 'sectors': 5},
    'MU019': {'name': 'Thalkirchen-Obersendling-Forstenried-Fürstenried-Solln', 'description': '', 'clan': ventrue,
              'sectors': 6},
    'MU020': {'name': 'Hadern', 'description': '', 'clan': malkavian, 'sectors': 3},
    'MU021': {'name': 'Pasing – Obermenzing', 'description': '', 'clan': toreador, 'sectors': 4},
    'MU022': {'name': 'Aubing-Lochhausen-Langwied', 'description': '', 'clan': gangrel, 'sectors': 3},
    'MU023': {'name': 'Allach Untermenzing', 'description': '', 'clan': nosferatu, 'sectors': 2},
    'MU024': {'name': 'Feldmoching-Hasenbergl', 'description': '', 'clan': ventrue, 'sectors': 4},
    'MU025': {'name': 'Laim', 'description': '', 'clan': brujah, 'sectors': 2},

}

HAMBURG_DISTRICTS = {
    'HH001': {'name': 'Allermöhe', 'description': '', 'clan': ventrue, 'sectors': 6},
    # 'h02': {'name': 'Ludwigvorstadt and Isarvorstadt', 'description': '', 'clan': toreador, 'sectors': 8},
    # 'h03': {'name': 'Maxvorstadt', 'description': '', 'clan': ventrue, 'sectors': 9},
    # 'h04': {'name': 'Schwabing West', 'description': '', 'clan': ventrue, 'sectors': 3},
    # 'h05': {'name': 'Au-Haidhausen', 'description': '', 'clan': malkavian, 'sectors': 6},
    # 'h06': {'name': 'Sendling', 'description': '', 'clan': ventrue, 'sectors': 2},
    # 'h07': {'name': 'Sendling – Westpark', 'description': '', 'clan': gangrel, 'sectors': 3},
    # 'h08': {'name': 'Schwanthalerhöhe', 'description': '', 'clan': toreador, 'sectors': 2},
    # 'h09': {'name': 'Neuhausen Nymphenburg', 'description': '', 'clan': toreador, 'sectors': 6},
    # 'h10': {'name': 'Moosach', 'description': '', 'clan': tremere, 'sectors': 2},
    # 'h11': {'name': 'Milbertshofen und Am Hart', 'description': '', 'clan': brujah, 'sectors': 3},
    # 'h12': {'name': 'Schwabing-Freimann', 'description': '', 'clan': brujah, 'sectors': 8},
    # 'h13': {'name': 'Bogenhausen', 'description': '', 'clan': ventrue, 'sectors': 7},
    # 'h14': {'name': 'Berg am Laim', 'description': '', 'clan': nosferatu, 'sectors': 1},
    # 'h15': {'name': 'Trudering – Riem', 'description': '', 'clan': ventrue, 'sectors': 4},
    # 'h16': {'name': 'Ramersdorf und Perlach', 'description': '', 'clan': nosferatu, 'sectors': 5},
    # 'h17': {'name': 'Obergiesing', 'description': '', 'clan': tremere, 'sectors': 2},
    # 'h18': {'name': 'Untergiesing und Harlaching', 'description': '', 'clan': gangrel, 'sectors': 5},
    # 'h19': {'name': 'Thalkirchen-Obersendling-Forstenried-Fürstenried-Solln', 'description': '', 'clan': ventrue,
    #         'sectors': 6},
    # 'h20': {'name': 'Hadern', 'description': '', 'clan': malkavian, 'sectors': 3},
    # 'h21': {'name': 'Pasing – Obermenzing', 'description': '', 'clan': toreador, 'sectors': 4},
    # 'h22': {'name': 'Aubing-Lochhausen-Langwied', 'description': '', 'clan': gangrel, 'sectors': 3},
    # 'h23': {'name': 'Allach Untermenzing', 'description': '', 'clan': nosferatu, 'sectors': 2},
    # 'h24': {'name': 'Feldmoching-Hasenbergl', 'description': '', 'clan': ventrue, 'sectors': 4},
    # 'h25': {'name': 'Laim', 'description': '', 'clan': brujah, 'sectors': 2},

}


def get_districts(cityname):
    from storytelling.models.cities import City
    from storytelling.models.districts import District
    from storytelling.models.hotspots import HotSpot
    from collector.utils.wod_reference import get_current_chronicle
    import json
    # print(cityname.title())

    chronicle = get_current_chronicle()

    cities = City.objects.filter(name=cityname.title())
    settings = {"player_safe": not chronicle.is_storyteller_only}
    context = {'districts': {}, 'hotspots': [], 'settings': settings, 'fontset':[]}
    if len(cities) == 1:
        city = cities.first()
        districts = District.objects.filter(city=city)
        for d in districts:
            context['districts'][d.code] = {
                'code': d.code,
                'fill': d.color,
                'title': d.title,
                'status': d.status,
                'district_name': d.district_name,
                'sector_name': d.sector_name,
                'population': d.population,
                'population_details': d.population_details,
                'camarilla_resources': d.camarilla_resources,
                'camarilla_power': d.camarilla_power,
                'camarilla_intelligence': d.camarilla_intelligence,
                'camarilla_leisure': d.camarilla_leisure
            }
        hotspots = HotSpot.objects.filter(city=city)
        for hs in hotspots:
            context['hotspots'].append({
                'type': 'feature',
                'geometry': {
                    'type': "Point",
                    "coordinates": [hs.latitude, hs.longitude]

                },
                'properties': {
                    'name': hs.name,
                    'color': hs.color,
                    'type': hs.type,
                    'code': hs.id,
                    'is_public': hs.is_public,
                    'visible': False,
                    'pos_visible': 500,
                    'hyperlink': hs.hyperlink,
                    'episode': hs.episode
                }
            })
    # print(context)
    context['fontset'] = FONTSET
    x = json.dumps(context, indent=4, sort_keys=True)
    return x
