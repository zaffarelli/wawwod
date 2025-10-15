import logging
from django.conf import settings
from collector.utils.wod_reference import get_current_chronicle

chronicle = get_current_chronicle()
logger = logging.Logger(__name__)


def domitor_from_sire():
    from collector.models.creatures import Creature
    ghouls = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['ghoul', 'kindred'])
    for g in ghouls:
        if g.sire != '':
            sires = Creature.objects.filter(name=g.sire)
            if len(sires) == 1:
                s = sires.first()
            else:
                s = None
            if s is not None:
                g.domitor = s
                if g.creature == 'ghoul':
                    g.subgroup = s.subgroup
                g.save()


def manage_missing_ghouls():
    from collector.models.creatures import Creature
    from random import random, randrange
    # Get the chronicle kindreds having retainers:
    kindreds = Creature.objects.filter(chronicle=chronicle.acronym, background8__gt=0, creature='kindred')
    for k in kindreds:
        ghouls = Creature.objects.filter(chronicle=chronicle.acronym, sire=k.rid, creature='ghoul')
        print()
        print("--", "Kindred", k.name, f"(Retainers={k.background8})")
        if len(ghouls):
            print("    ", "Current ghouls:")
        for g in ghouls:
            print("    --", g.name, f'(domitor={g.sire})')
            if g.position == '':
                x = randrange(0, 10) + 1
                if x > 9:  # 10
                    g.position = "Leisure"
                elif x > 8:  # 9
                    g.position = "Operative"
                elif x > 6:  # 7-8
                    g.position = "Intelligence"
                elif x > 3:  # 4-6
                    g.position = "Enforcer"
                else:  # 1-3
                    g.position = "Valet"
            if k.condition.startswith("MISSING"):
                words = k.condition.split("=")
                g.condition = "DEAD="+words[1]
            elif k.condition.startswith("DEAD"):
                g.condition = k.condition
            g.need_fix = True
            g.save()

        missed_count = k.background8 - len(ghouls)
        if missed_count:
            print("    ", f"{missed_count} ghouls to be created...")
            for x in range(missed_count):
                retainer = Creature()
                retainer.sire = k.rid
                retainer.creature = "ghoul"
                retainer.sex = random() < 0.5
                retainer.chronicle = chronicle.acronym
                retainer.age = randrange(15, 45)
                if k.trueage > 50:
                    retainer.trueage = k.trueage - randrange(15, k.trueage - 15)
                retainer.faction = k.faction
                retainer.family = k.family
                retainer.group = f"Ghouls of {k.name}"
                retainer.groupspec = k.groupspec
                retainer.randomize_backgrounds()
                retainer.randomize_archetypes()
                retainer.randomize_attributes()
                retainer.randomize_abilities()
                retainer.source = 'zaffarelli'
                retainer.name = f"{'Male' if retainer.sex else 'Female'} ghoul {x + 1} of {k.name}"
                retainer.save()
                print("    -+", retainer.name, f'(domitor={retainer.sire})')


def resort(list):
    vampires = []
    ghouls = []
    for creature in list:
        if creature['creature'] == 'kindred':
            vampires.append(creature)
        elif creature['creature'] == 'ghoul':
            ghouls.append(creature)

    sorted_list = []
    pre = True
    for vampire in vampires:
        sublist = []
        sublist.append(vampire)
        for ghoul in ghouls:
            if ghoul['sire'] == vampire['rid']:
                if pre:
                    sublist.insert(0, ghoul)
                else:
                    sublist.append(ghoul)
                pre = not pre
        for creature in sublist:
            sorted_list.append(creature)
    idx = 0
    for creature in sorted_list:
        creature['index'] = idx
        idx += 1
    return sorted_list


def roll(x):
    import random
    x = random.randint(0, x - 1) + 1
    return x
