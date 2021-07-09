def extract_raw(request,slug):
    found = Creature.objects.all().filter(rid=slug)
    if len(found) == 1:
        lines = found.first().extract_raw()
        return HttpResponse(lines, content_type='text/plain', charset="utf-16")
    return HttpResponse(status=204)


def extract_roster(request,slug):
    found = Creature.objects.all().filter(rid=slug)
    if len(found) == 1:
        lines = found.first().extract_roster()
        return HttpResponse(lines, content_type='text/html', charset="utf-16")
    return HttpResponse(status=204)


def extract_per_group(request,slug):
    grp_name = slug.replace('_', ' ')
    lines = []
    creatures = Creature.objects.all().filter(group=grp_name).order_by('groupspec')
    for creature in creatures:
        lines.append(creature.extract_roster())
    return HttpResponse(lines, content_type='text/html', charset="utf-16")


def extract_mechanics(request):
    all = Creature.objects.all().filter(creature="garou")
    stats_by_auspice = {
        '0': {'power1': 0, 'power2': 0, 'willpower': 0, 'cnt': 0},
        '1': {'power1': 0, 'power2': 0, 'willpower': 0, 'cnt': 0},
        '2': {'power1': 0, 'power2': 0, 'willpower': 0, 'cnt': 0},
        '3': {'power1': 0, 'power2': 0, 'willpower': 0, 'cnt': 0},
        '4': {'power1': 0, 'power2': 0, 'willpower': 0, 'cnt': 0},
    }

    all_known_gifts = []
    for c in all:
        x = f'{c.auspice}'
        stats_by_auspice[x]['power1'] += c.power1
        stats_by_auspice[x]['power2'] += c.power2
        stats_by_auspice[x]['willpower'] += c.willpower
        stats_by_auspice[x]['cnt'] += 1
        for n in range(10):
            gift = getattr(c, f'gift{n}')
            if gift:
                from collector.models.gifts import Gift
                gs = Gift.objects.filter(declaration=gift)
                if not len(gs):
                    go = Gift()
                    go.name = gift.split(' (')[0]
                    go.level = int(gift.split(' (')[1].split(')')[0])
                    go.fix()
                    go.save()

                if not gift.title() in all_known_gifts:
                    all_known_gifts.append(f'- {gift}')
    lines = "All known gifts:\n"
    all_known_gifts.sort()
    lines += "\n".join(all_known_gifts)
    all_kinfolks = []
    for c in all:
        num = 0
        kinfolk = c.value_of('kinfolk')
        if kinfolk == 1:
            num = 2
        elif kinfolk == 2:
            num = 5
        elif kinfolk == 3:
            num = 10
        elif kinfolk == 4:
            num = 20
        elif kinfolk == 5:
            num = 50
        my_kinfolk = []
        for n in range(num):
            my_kinfolk.append(f'- unknown #{n+1} ({c.name})')
        x = 0
        found_folks = Creature.objects.filter(creature='kinfolk',patron=c.name)
        for k in found_folks:
            my_kinfolk[x] = f'- {k.name} ({c.name})'
            x += 1
        for n in range(num):
            if my_kinfolk[n].startswith(f'- unknown #{n+1}'):
                nk = Creature()
                nk.faction = 'Gaia'
                nk.patron = c.name
                nk.creature = 'kinfolk'
                nk.name = f'NewKinfolk for {c.name} #{n+1}'
                nk.age = random.randrange(18,58)
                nk.need_fix = True
                nk.save()
        x = 0

        if len(my_kinfolk):
            all_kinfolks.append("\n".join(my_kinfolk))
    lines += "\nAll kinfolks:\n"
    lines += "\n".join(all_kinfolks)
    kinfolks = Creature.objects.filter(creature='kinfolk')
    for k in kinfolks:
        if k.condition == 'recalculate':
            k.randomize_kinfolk()
    lines += "\nPowers:\n"
    for a in range(5):
        x = f'{a}'
        stats_by_auspice[x]['power1'] /= stats_by_auspice[x]['cnt']
        stats_by_auspice[x]['power2'] /= stats_by_auspice[x]['cnt']
        stats_by_auspice[x]['willpower'] /= stats_by_auspice[x]['cnt']
        str = f'R:{round(stats_by_auspice[x]["power1"])} '
        str += f'G:{round(stats_by_auspice[x]["power2"])} '
        str += f'W:{round(stats_by_auspice[x]["willpower"])} '
        str += f'C:{stats_by_auspice[x]["cnt"]}\n'
        lines += str
    from collector.models.rites import Rite
    rites = Rite.objects.all()
    all_garous = Creature.objects.filter(creature='garou')
    for garou in all_garous:
        if garou.value_of("rites")>0:
            pass
    # all = Creature.objects.all()
    # for c in all:
    #     if c.domitor:
    #         c.new_domitor = c.domitor.name
    #         c.need_fix = True
    #         c.save()
    return HttpResponse(lines, content_type='text/plain', charset="utf-16")


def change_settings(request):
    pass


def refix_all(request):
    pass