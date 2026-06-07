from django.core.management.base import BaseCommand
from collector.models.creatures import Creature
from collector.utils.helper import fake_name
from collector.utils.kindred_stuff import manage_missing_ghouls, domitor_from_sire
from collector.models.adventures import Adventure
import random

class Command(BaseCommand):
    def handle(self, **options):
        ToolsForWawwod()

class ToolsForWawwod:
    def __init__(self):
        self.adventure, self.chronicle, self.season = Adventure.current_full()
        print("  This is WaWWoD tools:")
        print("    1 - Check freebies per age (rid asked later). (all)")
        print("    2 - Check lineage strength. (kindreds)")
        print("    3 - Randomize nature and demeanor when empty. (all)")
        print("    4 - Retrieve ghouls and childers (kindred)")
        print("    5 - XML rescue (kindred)")
        print("    6 - Sire as RID")
        print("    7 - Name ghouls...")
        print("    8 - Reghoul (kindreds)...")
        print("    9 - To current chronicle")
        print("    A - Populate from YAML")
        print("    B - Manage kinfolks")
        print("    C - Fix kinfolks (safe)")
        print("    S - Django Secret generator (safe)")
        print("    0 - Quit")
        topic = ""
        while topic != "0":
            topic = input("> What do you want to do? [0] ")
            if topic == "1":
                self.check_age()
            elif topic == "2":
                self.check_lineage()
            elif topic == "3":
                self.randomize_archetypes()
            elif topic == "4":
                self.retrieve_ghouls_and_childers()
            # elif topic == '5':
            #     self.xml_rescue()
            elif topic == "6":
                self.sire_as_rid()
            elif topic == "7":
                self.rename_ghouls()
            elif topic == "8":
                manage_missing_ghouls()
                domitor_from_sire()
            elif topic == "9":
                self.to_current_chronicle()
            elif topic == "A":
                self.populate_from_yml()
            elif topic == "B":
                self.manage_kinfolks()
            elif topic == "C":
                self.fix_kinfolks()
            elif topic == "S":
                self.secret_key()

    def fmt(self, txt):
        new_txt = "\033[1;39m".join(txt.split("µ"))
        new_txt = "\033[0;m".join(new_txt.split("§"))
        return new_txt

    def check_age(self):
        arid = input("  Character full rid ? [marius_flavius_vespasianus] ")
        if arid == "":
            arid = "marius_flavius_vespasianus"
        ms = Creature.objects.filter(rid__startswith=arid)
        if ms:
            for m in ms:
                print(self.fmt(f">"))
                print(self.fmt(f'> µ{m.name}§ rid ({m.rid}) starts with "{arid}".'))
                print(self.fmt(f"> {m.name} is a µ{m.creature}§"))
                a = m.freebies_per_mortal_age
                b = m.freebies_per_immortal_age
                c = m.freebies_per_age_threshold
                print(self.fmt(f"> Age: {m.age} / TrueAge: {m.trueage}"))
                print(self.fmt(f"> Freebies per mortal age...... {a}"))
                print(self.fmt(f"> Freebies per immortal age.... {b}"))
                print(self.fmt(f"> Freebies per age threshold... {c}"))
        else:
            print(self.fmt(f"Sorry, what? (µ{arid}§)"))
        print("Done.")

    def check_lineage(self):
        errors = []
        all = Creature.objects.filter(creature="kindred")
        for k in all:
            sire_name = k.sire
            ss = Creature.objects.filter(name=sire_name)
            if len(ss) == 1:
                s = ss.first()
                if k.embrace < s.embrace + 20:
                    errors.append(
                        self.fmt(
                            f"[{k.chronicle}]> Error for µ{k.name}§: sire {s.name} embraced in {s.embrace} AD ({k.name} embraced in {k.embrace} AD)."
                        )
                    )
        print(self.fmt(f"(µ{len(errors)}§ error(s) found.)"))
        report = "\n".join(errors)
        print(report)
        print("Done.")

    def randomize_archetypes(self):
        print("Starting choice 3...")
        all = Creature.objects.filter(chronicle=self.chronicle.acronym)
        total = len(all)
        print(f"Checking {total} creatures...")
        for c in all:
            if c.nature == "" and c.demeanor == "":
                c.randomize_archetypes()
                print(f"{c.name}: {c.nature} / {c.demeanor}")
            print(f"...still {total} to check.")
        print("...Done.")

    def retrieve_ghouls_and_childers(self):
        print(f"Choice 4: searching for childers and ghouls...")
        arid = input("  Sire/domitor full rid ? [_marius_flavius_vespasianus] ")
        if arid == "":
            arid = "_marius_flavius_vespasianus"
        domitor = Creature.objects.get(rid=arid)
        r = domitor.value_of("retainers")
        ghouls = Creature.objects.filter(creature="ghoul", sire=arid)
        print(f"Ghouls:")
        print(f"Retainers : {r}")
        for g in ghouls:
            print(f"--> {self.fmt(g.name)} [{g.rid}]")
            g.groupspec = domitor.groupspec
            g.need_fix = True
            g.save()
        childers = Creature.objects.filter(creature="kindred", sire=arid)
        print(f"Childers:")
        for c in childers:
            print(f"--> {self.fmt(c.name)} [{c.rid}]")

    def sire_as_rid(self):
        all = Creature.objects.filter(chronicle="BAV", creature="kindred")
        # for x in all:
        #     x.need_fix = False
        #     x.new_name = x.name
        #     x.save()
        for x in all:
            print(f"{x.name} has sire {x.sire}")
            if x.sire != "":
                sire_as_name = Creature.objects.filter(name=x.sire)
                if len(sire_as_name) == 1:
                    print(f"       => {sire_as_name.first().rid}")
                    x.sire = sire_as_name.first().rid
                    x.need_fix = True
                    x.save()
                sire_as_rid = Creature.objects.filter(rid=f"_{x.sire}")
                if len(sire_as_rid) == 1:
                    print("rid found")
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
        kindreds = Creature.objects.filter(
            chronicle=self.chronicle.acronym, background8__gt=0, creature="kindred"
        )
        for k in kindreds:
            if stop_it:
                print("(kindred loop stopped)")
                break
            ghouls = Creature.objects.filter(
                chronicle=self.chronicle.acronym, sire=k.rid, creature="ghoul"
            )
            print()
            print("--", "Kindred", k.name, f"(Retainers={k.background8})")
            if len(ghouls):
                print("    ", "Current ghouls:")
            for g in ghouls:
                print("    --", g.name, f"(domitor={g.sire})")
                if g.position == "":
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
                        if new_name == "=":
                            done = True
                            g.need_fix = True
                            g.is_new = False
                            g.save()
                            print("(passed)")
                        elif new_name == "*":
                            done = True
                            stop_it = True
                        else:
                            g.name = new_name
                            g.need_fix = True
                            g.is_new = False
                            g.save()
                            print("(changed)")
                            print("    ->", g.name, f"(domitor={g.sire})")
                            done = True
                if stop_it:
                    print("(ghoul loop stopped)")
                    break

    def to_current_chronicle(self):
        all = Creature.objects.filter(group="Sept of the Five Leaves")
        if len(all) > 0:
            for c in all:
                print(c.name)
                c.chronicle = self.chronicle.acronym
                c.save()


    def populate_from_yaml(self):
        pass

    def manage_kinfolks(self):
        total = 0
        kinfolk_count = [0,2,5,10,20,50]
        # all garous from the current chronicle
        all = Creature.objects.filter(chronicle=self.chronicle.acronym, creature="garou").exclude(condition__startswith="DEAD").exclude(condition__startswith="MISSING")
        for c in all:
            e = c.edges
            k = c.value_of("kinfolk")
            if k>0:
                r = kinfolk_count[k]
                m = 0
                print("")
                print(f"Garou .................. {c.name}")
                print(f"Entrance ............... {c.entrance}")
                print(f"kinfolks ............... background:{k} => {r} kinfolks")
                print(f"Edges .................. {e if len(e)>0 else '<none>'}")
                if len(e)>0:
                    p = e.split(", ")
                    if len(p)==r:
                        print(f"Status ................. OK")
                    else:
                        print(f"Status ................. Missing {r-len(p)} kinfolks")
                        m = r-len(p)
                    total += r-len(p)
                else:
                    print(f"Status ................. Missing {r} kinfolks")
                    total += r
                    m = r
                for x in range(m):
                    n = fake_name()
                    print(f"New kinfolk ............ [{n}]")
                    kinfolk = Creature()
                    kinfolk.name = n
                    kinfolk.chronicle = self.chronicle.acronym
                    kinfolk.creature = 'kinfolk'
                    kinfolk.need_fix = True
                    kinfolk.save()
                    kinfolk.randomize_all()
                    kinfolk.save()
                    c_edges = c.edges.split(", ")
                    c_edges.append(kinfolk.rid)
                    c.edges = ", ".join(c_edges)
                    c.save()


        print(f"To create .............. {total} kinfolks")

    def fix_kinfolks(self):
        # all garous from the current chronicle
        creatures = Creature.objects.filter(chronicle=self.chronicle.acronym, creature="kinfolk").exclude(condition__startswith="DEAD").exclude(condition__startswith="MISSING")
        for creature in creatures:
            if len(creature.edge_for)>0:
                patron = Creature.objects.get(name=creature.edge_for)
                creature.faction = patron.faction
                creature.group = patron.group
                creature.groupspec = patron.groupspec
                creature.save()

    def secret_key(self):
        chars = 'abcdefghijklmnopqrstuvwxyz' \
                'ABCDEFGHIJKLMNOPQRSTUVXYZ' \
                '0123456789' \
                '#()^[]-_*%&=+/'

        SECRET_KEY = ''.join([random.SystemRandom().choice(chars) for i in range(50)])

        print(SECRET_KEY)