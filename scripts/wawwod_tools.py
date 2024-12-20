# exec(open('scripts/wawwod_tools.py').read())
from collector.models.creatures import Creature
from collector.utils.wod_reference import ARCHETYPES
# import xmltodict
import random
from collector.utils.kindred_stuff import manage_missing_ghouls, domitor_from_sire

from collector.utils.wod_reference import get_current_chronicle

chronicle = get_current_chronicle()


class ToolsForWawwod:
    def __init__(self):
        print('  This is WaWWoD tools:')
        print('    1 - Check freebies per age (rid asked later). (all)')
        print('    2 - Check lineage strength. (kindreds)')
        print('    3 - Randomize nature and demeanor when empty. (all)')
        print('    4 - Retrieve ghouls and childers (kindred)')
        print('    5 - XML rescue (kindred)')
        print('    6 - Sire as RID')
        print('    7 - Name ghouls...')
        print('    8 - Reghoul (kindreds)...')
        print('    9 - To current chronicle')
        print('    0 - Quit')
        topic = ''
        while topic != '0':
            topic = input("> What do you want to do? [0] ")
            if topic == '1':
                self.check_age()
            elif topic == '2':
                self.check_lineage()
            elif topic == '3':
                self.randomize_archetypes()
            elif topic == '4':
                self.retrieve_ghouls_and_childers()
            # elif topic == '5':
            #     self.xml_rescue()
            elif topic == '6':
                self.sire_as_rid()
            elif topic == '7':
                self.rename_ghouls()
            elif topic == '8':
                manage_missing_ghouls()
                domitor_from_sire()
            elif topic == '9':
                self.to_current_chronicle()
    def fmt(self, txt):
        new_txt = "\033[1;39m".join(txt.split('µ'))
        new_txt = "\033[0;m".join(new_txt.split('§'))
        return new_txt

    def check_age(self):
        arid = input('  Character full rid ? [marius_flavius_vespasianus] ')
        if arid == '':
            arid = 'marius_flavius_vespasianus'
        ms = Creature.objects.filter(rid__startswith=arid)
        if ms:
            for m in ms:
                print(self.fmt(f'>'))
                print(self.fmt(f'> µ{m.name}§ rid ({m.rid}) starts with "{arid}".'))
                print(self.fmt(f'> {m.name} is a µ{m.creature}§'))
                a = m.freebies_per_mortal_age
                b = m.freebies_per_immortal_age
                c = m.freebies_per_age_threshold
                print(self.fmt(f'> Age: {m.age} / TrueAge: {m.trueage}'))
                print(self.fmt(f'> Freebies per mortal age...... {a}'))
                print(self.fmt(f'> Freebies per immortal age.... {b}'))
                print(self.fmt(f'> Freebies per age threshold... {c}'))
        else:
            print(self.fmt(f'Sorry, what? (µ{arid}§)'))
        print('Done.')

    def check_lineage(self):
        errors = []
        all = Creature.objects.filter(creature='kindred')
        for k in all:
            sire_name = k.sire
            ss = Creature.objects.filter(name=sire_name)
            if len(ss) == 1:
                s = ss.first()
                if k.embrace < s.embrace:
                    errors.append(self.fmt(f'[{k.chronicle}]> Error for µ{k.name}§: sire {s.name} embraced in {s.embrace} AD ({k.name} embraced in {k.embrace} AD).'))
        print(self.fmt(f'(µ{len(errors)}§ error(s) found.)'))
        report = "\n".join(errors)
        print(report)
        print('Done.')

    def randomize_archetypes(self):
        print('Starting choice 3...')
        all = Creature.objects.all()
        total = len(all)
        print(f'Checking {total} creatures...')
        for c in all:
            nature = ''
            demeanor = ''
            if c.nature == '':
                nature = random.choice(ARCHETYPES)
            if c.demeanor == '':
                demeanor = random.choice(ARCHETYPES)
            if nature != '' or demeanor != '':
                print(self.fmt(f'> Changes for µ{c.name}§: '))
                if nature != '':
                    c.nature = nature
                    print(self.fmt(f'> New nature: µ{nature}§'))
                if demeanor != '':
                    c.demeanor = demeanor
                    print(self.fmt(f'> New demeanor: µ{demeanor}§'))
                c.need_fix = True
                c.save()
            total -= 1
            print(f'...still {total} to check.')
        print('...Done.')

    def retrieve_ghouls_and_childers(self):
        print(f'Choice 4: searching for childers and ghouls...')
        arid = input('  Sire/domitor full rid ? [_marius_flavius_vespasianus] ')
        if arid == '':
            arid = '_marius_flavius_vespasianus'
        domitor = Creature.objects.get(rid=arid)
        r = domitor.value_of('retainers')
        ghouls = Creature.objects.filter(creature='ghoul', sire=arid)
        print(f'Ghouls:')
        print(f'Retainers : {r}')
        for g in ghouls:
            print(f'--> {self.fmt(g.name)} [{g.rid}]')
            g.groupspec = domitor.groupspec
            g.need_fix = True
            g.save()
        childers = Creature.objects.filter(creature='kindred', sire=arid)
        print(f'Childers:')
        for c in childers:
            print(f'--> {self.fmt(c.name)} [{c.rid}]')

    def sire_as_rid(self):
        all = Creature.objects.filter(chronicle='BAV', creature='kindred')
        # for x in all:
        #     x.need_fix = False
        #     x.new_name = x.name
        #     x.save()
        for x in all:
            print(f'{x.name} has sire {x.sire}')
            if x.sire != '':
                sire_as_name = Creature.objects.filter(name=x.sire)
                if len(sire_as_name) == 1:
                    print(f'       => {sire_as_name.first().rid}')
                    x.sire = sire_as_name.first().rid
                    x.need_fix = True
                    x.save()
                sire_as_rid = Creature.objects.filter(rid=f'_{x.sire}')
                if len(sire_as_rid) == 1:
                    print('rid found')
                    x.sire = sire_as_rid.first().rid
                    x.need_fix = True
                    x.save()

    def xml_rescue(self):
        pass
        # import xml.dom.minidom
        # import xml.etree.ElementTree as ET
        # # mytree = ET.parse('scripts/creatures.xml')
        # # myroot = mytree.getroot()
        # # for x in myroot[0]:
        # #     for f in x:
        # #         pk = f.find('rid').text
        # #         print(pk)
        #
        # with open('scripts/creatures.xml') as fd:
        #     doc = xmltodict.parse(fd.read())
        # for creature in doc['django-objects']['object']:
        #     print(creature['@pk'])
        #     c = Creature.objects.get(rid=creature['@pk'])
        #     print(c)
        #     for field in creature['field']:
        #         if field['@name'] == 'age':
        #             c.age = int(field['#text'])
        #             print(field['@name'], field['#text'])
        #         if field['@name'] == 'creature':
        #             c.creature = field['#text']
        #             print(field['@name'], field['#text'])
        #         if field['@name'] == 'trueage':
        #             c.trueage = int(field['#text'])
        #             print(field['@name'], field['#text'])
        #         if field['@name'] == 'embrace':
        #             c.embrace = int(field['#text'])
        #             print(field['@name'], field['#text'])
        #         if field['@name'] == 'torpor':
        #             c.torpor = int(field['#text'])
        #             print(field['@name'], field['#text'])
        #         c.need_fix = True
        #         c.save()

    def rename_ghouls(self):
        from random import random, randrange
        # Get the chronicle kindreds having retainers:
        stop_it = False
        kindreds = Creature.objects.filter(chronicle=chronicle.acronym, background8__gt=0, creature='kindred')
        for k in kindreds:
            if stop_it:
                print("(kindred loop stopped)")
                break
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
                    g.condition = "DEAD"
                elif k.condition.startswith("DEAD"):
                    g.condition = "DEAD"
                if g.is_new:
                    done = False
                    while not done:
                        new_name = input(f"> New name for {g.name} ? [=] ")
                        if new_name == '=':
                            done = True
                            g.need_fix = True
                            g.is_new = False
                            g.save()
                            print("(passed)")
                        elif new_name == '*':
                            done = True
                            stop_it = True
                        else:
                            g.name = new_name
                            g.need_fix = True
                            g.is_new = False
                            g.save()
                            print("(changed)")
                            print("    ->", g.name, f'(domitor={g.sire})')
                            done = True
                if stop_it:
                    print("(ghoul loop stopped)")
                    break

    def to_current_chronicle(self):
        all = Creature.objects.filter(group="Sept of the Five Leaves")
        if len(all)>0:
            for c in all:
                print(c.name)
                c.chronicle = chronicle.acronym
                c.save()



ToolsForWawwod()
