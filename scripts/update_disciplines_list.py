# exec(open('scripts/update_disciplines_list.py').read())
from collector.models.disciplines import Discipline

disciplines = Discipline.objects.filter(level=1)
for d in disciplines:
    for x in range(8):
        matches = Discipline.objects.filter(level=x+2, name=d.name)
        if len(matches) == 0:
            n = Discipline()
            n.name = d.name
            n.level = x+2
            n.clan_0 = d.clan_0
            n.clan_1 = d.clan_1
            n.clan_2 = d.clan_2
            n.clan_3 = d.clan_3
            n.clan_4 = d.clan_4
            n.clan_5 = d.clan_5
            n.clan_6 = d.clan_6
            n.clan_7 = d.clan_7
            n.clan_8 = d.clan_8
            n.clan_9 = d.clan_9
            n.clan_10 = d.clan_10
            n.clan_11 = d.clan_11
            n.clan_12 = d.clan_12
            n.has_rituals = d.has_rituals
            n.save()
            print(f'{n.code} created...')

