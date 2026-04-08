from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt

from collector.models.creatures import Creature
from collector.utils.helper import is_ajax

# from collector.utils.wod_reference import get_current_chronicle
import random


def extract_raw(request, slug):
    found = Creature.objects.all().filter(rid=slug)
    if len(found) == 1:
        lines = found.first().extract_raw()
        return HttpResponse(lines, content_type="text/plain", charset="utf-16")
    return HttpResponse(status=204)


def extract_roster(request, slug):
    found = Creature.objects.all().filter(rid=slug)
    if len(found) == 1:
        lines = found.first().extract_roster()
        return HttpResponse(lines, content_type="text/html", charset="utf-16")
    return HttpResponse(status=204)


def extract_per_group(request, slug):
    grp_name = slug.replace("_", " ")
    lines = []
    creatures = Creature.objects.all().filter(group=grp_name).order_by("groupspec")
    for creature in creatures:
        lines.append(creature.extract_roster())
    return HttpResponse(lines, content_type="text/html", charset="utf-16")


def extract_mechanics(request):
    all = Creature.objects.all().filter(creature="garou")
    stats_by_auspice = {
        "0": {"power1": 0, "power2": 0, "willpower": 0, "cnt": 0},
        "1": {"power1": 0, "power2": 0, "willpower": 0, "cnt": 0},
        "2": {"power1": 0, "power2": 0, "willpower": 0, "cnt": 0},
        "3": {"power1": 0, "power2": 0, "willpower": 0, "cnt": 0},
        "4": {"power1": 0, "power2": 0, "willpower": 0, "cnt": 0},
    }

    all_known_gifts = []
    for c in all:
        x = f"{c.auspice}"
        stats_by_auspice[x]["power1"] += c.power1
        stats_by_auspice[x]["power2"] += c.power2
        stats_by_auspice[x]["willpower"] += c.willpower
        stats_by_auspice[x]["cnt"] += 1
        for n in range(10):
            gift = getattr(c, f"gift{n}")
            if gift:
                from collector.models.gifts import Gift

                gs = Gift.objects.filter(declaration=gift)
                if not len(gs):
                    go = Gift()
                    go.name = gift.split(" (")[0]
                    go.level = int(gift.split(" (")[1].split(")")[0])
                    go.fix()
                    go.save()

                if not gift.title() in all_known_gifts:
                    all_known_gifts.append(f"- {gift}")
    lines = "All known gifts:\n"
    all_known_gifts.sort()
    lines += "\n".join(all_known_gifts)
    all_kinfolks = []
    for c in all:
        num = 0
        kinfolk = c.value_of("kinfolk")
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
            my_kinfolk.append(f"- unknown #{n + 1} ({c.name})")
        x = 0
        found_folks = Creature.objects.filter(creature="kinfolk", patron=c.name)
        for k in found_folks:
            my_kinfolk[x] = f"- {k.name} ({c.name})"
            x += 1
        for n in range(num):
            if my_kinfolk[n].startswith(f"- unknown #{n + 1}"):
                nk = Creature()
                nk.faction = "Gaia"
                nk.patron = c.name
                nk.creature = "kinfolk"
                nk.name = f"NewKinfolk for {c.name} #{n + 1}"
                nk.age = random.randrange(18, 58)
                nk.need_fix = True
                nk.save()
        x = 0

        if len(my_kinfolk):
            all_kinfolks.append("\n".join(my_kinfolk))
    lines += "\nAll kinfolks:\n"
    lines += "\n".join(all_kinfolks)
    kinfolks = Creature.objects.filter(creature="kinfolk")
    for k in kinfolks:
        if k.condition == "recalculate":
            k.randomize_kinfolk()
    lines += "\nPowers:\n"
    for a in range(5):
        x = f"{a}"
        stats_by_auspice[x]["power1"] /= stats_by_auspice[x]["cnt"]
        stats_by_auspice[x]["power2"] /= stats_by_auspice[x]["cnt"]
        stats_by_auspice[x]["willpower"] /= stats_by_auspice[x]["cnt"]
        str = f"R:{round(stats_by_auspice[x]['power1'])} "
        str += f"G:{round(stats_by_auspice[x]['power2'])} "
        str += f"W:{round(stats_by_auspice[x]['willpower'])} "
        str += f"C:{stats_by_auspice[x]['cnt']}\n"
        lines += str
    from collector.models.rites import Rite

    rites = Rite.objects.all()
    all_garous = Creature.objects.filter(creature="garou")
    for garou in all_garous:
        if garou.value_of("rites") > 0:
            pass
    # all = Creature.objects.all()
    # for c in all:
    #     if c.domitor:
    #         c.new_domitor = c.domitor.name
    #         c.need_fix = True
    #         c.save()
    return HttpResponse(lines, content_type="text/plain", charset="utf-16")


def change_settings(request):
    pass


@csrf_exempt
def deed_select(request):
    answer = {}
    if is_ajax(request):
        params = request.POST.get("params")
        words = params.split("__")
        deed_code = words[1]
        adventure = words[0]
        if len(words) == 2:
            from collector.models.adventures import Adventure

            print("deed", deed_code, "adventure", adventure)
            adventure = Adventure.objects.filter(acronym=adventure).first()
            if adventure:
                result = adventure.update_deeds(deed_code)
                answer["deed"] = result
            else:
                print(f"Adventure {adventure} not found!")

    return JsonResponse(answer)


def experiment(request):
    # from collector.models.archetypes import Archetype
    # Archetype.reid()
    return HttpResponse(status=204)


def old3_experiment(request):
    from collector.models.gifts import Gift

    id = 1
    for gift in Gift.objects.all().order_by("name"):
        gift.id = id
        id += 1
        gift.save()
    return HttpResponse(status=204)


def old2_experiment(request):
    from collector.models.gifts import Gift

    with open("all_wta20_gifts.txt", "r") as f:
        lines = f.readlines()
    for line in lines:
        sanitized_line = line.strip()
        parts = sanitized_line.split(" ")
        page = parts[-1]
        title = sanitized_line.replace(" " + page, "")
        print(title)
        print(page)
        found = Gift.objects.filter(name=title)
        if len(found) == 0:
            g = Gift()
            g.name = title
            g.level = 1
            g.source_page = page
            g.save()
        else:
            g = found.first()
            if g.source_page == "":
                g.source_page = page
            g.save()

    return HttpResponse(status=204)


def old_experiment(request):
    print("Experimental")

    # from collector.models.deeds import Deed
    # html = Deed.all_to_html()

    def roll_hand(dice=4, diff=6):
        from collector.utils.helper import roll

        success = 0
        nominal_success = 0
        cancel = 0
        pool = []
        for die in range(dice):
            pool.append(roll())
        for die in pool:
            if die > diff:
                success += 1
            elif die == diff:
                nominal_success += 1
            elif die == 1:
                cancel += 1
        if nominal_success >= cancel:
            nominal_success -= cancel
        else:
            nominal_success = 0
            cancel -= nominal_success
        if success > 0:
            success += nominal_success
        else:
            if nominal_success < cancel:
                success = -1
            else:
                success = nominal_success
        return success, pool

    html = []
    html.append("<div class='html_block'>")
    html.append("<table class='renown'>")
    much = 100000
    total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for x in range(much):
        dice = 12
        diff = 6
        s, det = roll_hand(dice=dice, diff=diff)
        total[s + 1] += 1
        # html.append(f"<tr><th>{dice} dice vs diff {diff}</th><td>{s}</td><td class='text'>{det}</td></tr>")
    html.append(f"<tr><th>TOTAL</th><td colspan=2 class='text'>{total}</td></tr>")
    botch = total[0]
    failure = total[1]
    success = 0
    for k, v in enumerate(total):
        if k > 1:
            success += v
    html.append(
        f"<tr><th>Ratio</th><td colspan=2>{(botch / much) * 100:.2f}% botch -- {(failure / much) * 100.0:.2f}% failure -- {(success / much) * 100:.2f}% success</td></tr>"
    )
    html.append("</table>")
    html.append("</div>")

    answer = {"html": "".join(html)}
    return JsonResponse(answer)


def refix_all(request):
    chronicle = get_current_chronicle()
    import json

    all = Creature.objects.filter(concept="death_row")
    for c in all:
        c.delete()
    all = Creature.objects.filter(chronicle=chronicle.acronym)
    for c in all:
        c.save()
    from storytelling.models.districts import District

    alld = District.objects.all()
    for d in alld:
        d.save()
    from storytelling.models.hotspots import HotSpot

    allhp = HotSpot.objects.all()
    for h in allhp:
        h.save()
    data = Creature.extract_ghouls(chronicle.acronym)
    with open("kindred_ghouls.json", "w") as f:
        f.write(json.dumps(data, sort_keys=True, indent=4))
    return HttpResponse(status=204)


def randomize_attributes(request, slug):
    found = Creature.objects.all().filter(rid=slug)
    if len(found) == 1:
        x = found.first()
        x.randomize_attributes()
        x.save()
    return HttpResponse(status=204)


def balance(request, slug):
    answer = {}
    found = Creature.objects.filter(rid=slug)
    if len(found) == 1:
        x = found.first()
        x.balance_ghoul()
        answer["rid"] = x.rid
    return JsonResponse(answer)


def randomize(request, slug):
    answer = {}
    found = Creature.objects.filter(rid=slug)
    if len(found) == 1:
        x = found.first()
        x.randomize_all()
        x.save()
        answer["rid"] = x.rid
    return JsonResponse(answer)
