import logging
from django.conf import settings
from collector.utils.wod_reference import get_current_chronicle

chronicle = get_current_chronicle()
logger = logging.Logger(__name__)


def domitor_from_sire():
    from collector.models.creatures import Creature
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
                x = randrange(0,10)+1
                if x > 9:    # 10
                    g.position = "Leisure"
                elif x > 8:  # 9
                    g.position = "Operative"
                elif x > 6:  # 7-8
                    g.position = "Intelligence"
                elif x > 3:  # 4-6
                    g.position = "Enforcer"
                else:        #  1-3
                    g.position = "Valet"
            if k.condition == "MISSING":
                g.condition = "DEAD"
            elif k.condition == "DEAD":
                g.condition = "DEAD"
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
                if k.trueage>50:
                    retainer.trueage = k.trueage - randrange(15, k.trueage-15)
                retainer.faction = k.faction
                retainer.family = k.family
                retainer.group = k.group
                retainer.randomize_backgrounds()
                retainer.randomize_archetypes()
                retainer.randomize_attributes()
                retainer.randomize_abilities()
                retainer.source = 'zaffarelli'
                retainer.name = f"{'Male' if retainer.sex else 'Female'} ghoul {x + 1} {k.name}"
                retainer.save()
                print("    -+", retainer.name, f'(domitor={retainer.sire})')



