from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import render
import random

from collector.models.adventures import Adventure
from collector.models.seasons import Season
from collector.models.creatures import Creature
from storytelling.models.cities import City
from django.core.paginator import Paginator
from django.template.loader import get_template
from django.views.decorators.csrf import csrf_exempt
from collector.templatetags.wod_filters import as_bullets
from collector.utils.data_collection import build_per_primogen, build_gaia_wheel
from collector.utils.wod_reference import get_current_chronicle
from collector.models.chronicles import Chronicle
from collector.models.septs import Sept
from collector.utils.wod_reference import STATS_NAMES, CHARACTERS_PER_PAGE
import json
from collector.utils.wod_reference import FONTSET
from collector.utils.data_collection import improvise_id
from django.contrib.auth.decorators import login_required
from django.conf import settings
from collector.utils.helper import is_ajax
import os
import logging
import datetime
from astral import moon

logger = logging.Logger(__name__)


def prepare_index(request):
    chronicles = []
    players = []
    cities = []
    chronicle = get_current_chronicle()
    plist = Creature.objects.filter(chronicle=chronicle.acronym).exclude(player='').exclude(adventure="").order_by(
        'adventure')
    prev_a = None
    adventure = None
    for p in plist:
        if p.adventure != prev_a:
            adv = Adventure.objects.filter(acronym=p.adventure, current=True)
            if len(adv) > 0:
                a = adv.first()
                prev_a = a.code
                adventure = {'adventure': a.name, 'players': []}
                players.append(adventure)
        if adventure:
            adventure['players'].append(
                {'name': p.name, 'rid': p.rid, 'player': p.player, 'pre_change_access': p.pre_change_access})

    for c in Chronicle.objects.all():
        chronicles.append({'name': c.name, 'acronym': c.acronym, 'active': c.is_current})
    cities = []
    adventures = []
    seasons = []
    septs = []
    for sept in Sept.objects.filter(chronicle=chronicle.acronym):
        septs.append(sept)
    for season in Season.objects.filter(chronicle=chronicle.acronym, current=True):
        seasons.append(season)
        # print(season)
        for adventure in Adventure.objects.filter(season=season.acronym, current=True):
            adventures.append(adventure)
            # print(adventure)
    for city in City.objects.filter(chronicle=chronicle.acronym):
        cities.append(city)
    #        //print("New city: ",city)

    misc = {"version": settings.VERSION}
    context = {'chronicles': chronicles, 'fontset': FONTSET, 'players': players, 'adventures': adventures,
               'seasons': seasons,
               'septs': septs, 'cities': cities, 'miscellaneous': misc, "weeks": moon_phase(None)}

    return context


@login_required
def index(request):
    if not request.user.is_authenticated:
        return render(request, 'collector/registration/login_error.html')
    context = prepare_index(request)
    return render(request, 'collector/index.html', context=context)


def change_chronicle(request, slug=None):
    if is_ajax(request):
        from collector.utils.wod_reference import set_chronicle
        set_chronicle(slug)
        context = prepare_index(request)
        return render(request, 'collector/index.html', context=context)


def get_list(request, pid=1, slug=None):
    chronicle = get_current_chronicle()
    # print(slug)
    # print(chronicle.acronym)
    if is_ajax(request):
        if 'vtm' == slug:
            # print('vampires')
            creature_items = Creature.objects \
                .filter(chronicle=chronicle.acronym, creature__in=['ghoul', 'kindred']) \
                .order_by('-is_new', 'is_player', 'name')
        elif 'mta' == slug:
            creature_items = Creature.objects \
                .filter(chronicle=chronicle.acronym, creature__in=['mage']) \
                .order_by('-is_new', 'is_player', 'name')
        elif 'wta' == slug:
            creature_items = Creature.objects \
                .filter(chronicle=chronicle.acronym, creature__in=['garou', 'kinfolk']) \
                .order_by('-is_new', 'creature', 'name')
        elif 'ctd' == slug:
            creature_items = Creature.objects \
                .filter(chronicle=chronicle.acronym, creature__in=['changeling']) \
                .order_by('-is_new', 'is_player', 'name')
        elif 'wto' == slug:
            creature_items = Creature.objects \
                .filter(chronicle=chronicle.acronym, creature__in=['wraith']) \
                .order_by(
                '-is_new', 'is_player', 'name')
        elif 'mor' == slug:
            creature_items = Creature.objects \
                .filter(chronicle=chronicle.acronym, creature__in=['mortal']) \
                .order_by('-is_new', 'is_player', 'name')
        elif 'new' == slug:
            creature_items = Creature.objects \
                .filter(chronicle=chronicle.acronym, is_new=True) \
                .order_by('-is_new', 'is_player', 'name')
        elif 'bal' == slug:
            creature_items = Creature.objects \
                .filter(chronicle=chronicle.acronym, status__in=["UNBALANCED", "OK+"], hidden=False) \
                .order_by('-is_new', 'is_player', 'name')
        elif 'pen' == slug:
            creature_items = Creature.objects \
                .filter(chronicle=chronicle.acronym, faction__in=['Pentex', 'Wyrm'],
                        creature__in=['garou', 'kinfolk', 'fomori']) \
                .order_by('-is_new', 'is_player', 'name')
        elif 'ccm' == slug:
            servants = ['mortal', 'ghoul', 'kinfolk', 'fomori', 'kithain']
            creature_items = Creature.objects \
                .filter(chronicle=chronicle.acronym, creature__in=servants) \
                .order_by('name')
        elif 'ccs' == slug:
            masters = ['garou', 'kindred', 'wraith', 'changeling', 'mage']
            creature_items = Creature.objects \
                .filter(chronicle=chronicle.acronym, creature__in=masters) \
                .order_by('name')
        else:
            creature_items = Creature.objects \
                .filter(chronicle=chronicle.acronym) \
                .order_by('is_player','family','is_new','name')
        paginator = Paginator(creature_items, CHARACTERS_PER_PAGE)
        creature_items = paginator.get_page(pid)
        list_context = {'creature_items': creature_items}
        list_template = get_template('collector/list.html')
        list_html = list_template.render(list_context)
        answer = {
            'list': list_html,
        }
        return JsonResponse(answer)
    else:
        return HttpResponse(status=204)


@csrf_exempt
def updown(request):
    if is_ajax(request):
        answer = 'error'
        if request.method == 'POST':
            answer = {}
            rid = request.POST.get('id')
            field = request.POST.get('field')
            offset = int(request.POST.get('offset'))
            item = Creature.objects.get(rid=rid)
            if hasattr(item, field):
                current_val = getattr(item, field, 'Oops, nothing found')
                new_val = int(current_val) + int(offset)
                setattr(item, field, new_val)
                item.need_fix = True
                item.save()
                answer['new_value'] = as_bullets(getattr(item, field))
                answer['freebies'] = item.freebies
            else:
                answer['new_value'] = '<b>ERROR!</b>'
        return JsonResponse(answer)
    return Http404


@csrf_exempt
def userinput(request):
    if is_ajax(request):
        answer = 'error'
        if request.method == 'POST':
            answer = {}
            rid = request.POST.get('id')
            field = request.POST.get('field')
            value = request.POST.get('value')
            item = Creature.objects.get(rid=rid)
            if hasattr(item, field):
                setattr(item, field, value)
                item.need_fix = True
                item.save()
                answer['new_value'] = value
                answer['freebies'] = item.freebies
            else:
                answer['new_value'] = '<b>ERROR!</b>'
        return JsonResponse(answer)
    return HttpResponse(status=204)


@csrf_exempt
def userinputastext(request):
    if is_ajax(request):
        answer = 'error'
        if request.method == 'POST':
            answer = {}
            rid = request.POST.get('id')
            field = request.POST.get('field')
            value = request.POST.get('value')
            item = Creature.objects.get(rid=rid)
            if hasattr(item, field):
                setattr(item, field, value)
                item.need_fix = True
                item.save()
                answer['new_value'] = value
                answer['freebies'] = item.freebies
            else:
                answer['new_value'] = '<b>ERROR!</b>'
        return JsonResponse(answer)
    return HttpResponse(status=204)


def add_creature(request, slug=None):
    if is_ajax(request):

        name = " ".join(slug.split("_"))
        chronicle = get_current_chronicle()
        item = Creature()
        item.name = name
        item.chronicle = chronicle.acronym
        item.creature = 'mortal'
        item.age = 25
        if slug == 'kindred':
            item.creature = 'kindred'
            item.age = 0
            item.family = 'Caitiff'
            item.faction = 'Camarilla'
            item.randomize_backgrounds()
            item.randomize_archetypes()
            item.randomize_attributes()
            item.randomize_abilities()
        item.source = 'zaffarelli'
        item.save()
        context = {'answer': 'creature added'}
        return HttpResponse(status=204)


def pre_wawwod_creature(slug):
    name = " ".join(slug.split("_"))
    chronicle = get_current_chronicle()
    item = Creature()
    item.name = name
    item.chronicle = chronicle.acronym
    adventure = chronicle.adventure
    if adventure:
        item.adventure = adventure.acronym
    item.age = 25
    item.is_new = True
    return item


def post_wawwod_creature(item):
    if item:
        item.randomize_backgrounds()
        item.randomize_archetypes()
        item.randomize_attributes()
        item.randomize_abilities()
        item.source = 'zaffarelli'
        item.save()


def add_kindred(request, slug=None):
    if is_ajax(request):
        item = pre_wawwod_creature(slug)
        item.creature = 'kindred'
        item.family = 'Caitiff'
        item.faction = 'Camarilla'
        post_wawwod_creature(item)
        return HttpResponse(status=204)


def add_ghoul(request, slug=None):
    if is_ajax(request):
        item = pre_wawwod_creature(slug)
        item.creature = 'ghoul'
        item.family = 'Caitiff'
        item.faction = 'Camarilla'
        post_wawwod_creature(item)
        return HttpResponse(status=204)


def add_garou(request, slug=None):
    if is_ajax(request):
        item = pre_wawwod_creature(slug)
        item.creature = 'garou'
        item.family = 'Child of Gaia'
        item.faction = 'Gaia'
        post_wawwod_creature(item)
        return HttpResponse(status=204)


def add_kinfolk(request, slug=None):
    if is_ajax(request):
        item = pre_wawwod_creature(slug)
        item.creature = 'kinfolk'
        item.family = 'Child of Gaia'
        item.faction = 'Gaia'
        post_wawwod_creature(item)
        return HttpResponse(status=204)


def add_mortal(request, slug=None):
    if is_ajax(request):
        item = pre_wawwod_creature(slug)
        item.creature = 'mortal'
        post_wawwod_creature(item)
        return HttpResponse(status=204)


def add_new_ghoul(request, slug=None):
    if is_ajax(request):
        needed_ghouls = 0
        domitor_rid = toRID(slug)
        domitors = Creature.objects.filter(creature='kindred', rid=domitor_rid)
        if len(domitors) == 1:
            domitor = domitors.first()
            ghouls = Creature.objects.filter(sire=domitor.rid)
            if len(ghouls) < domitor.value_of('retainers'):
                needed_ghouls = domitor.value_of('retainers') - len(ghouls)
            for x in range(needed_ghouls):
                item = Creature()
                item.name = improvise_id()
                item.chronicle = domitor.chronicle
                item.creature = 'ghoul'
                item.age = random.randrange(0, 19) + 20
                item.family = domitor.family
                item.groupspec = domitor.groupspec
                item.sire = domitor.rid
                item.faction = domitor.faction
                item.randomize_backgrounds()
                item.randomize_archetypes()
                item.randomize_attributes()
                item.randomize_abilities()
                item.source = 'zaffarelli'
                item.is_new = True
                item.need_fix = True
                item.save()
        return HttpResponse(status=204)


def character_for(slug, option=None, idx=-1):
    print("hello: ", slug)
    c = None
    cs = Creature.objects.filter(rid=slug.strip())
    if len(cs) > 0:
        c = cs.first()
    else:
        print("oops,", slug)
    print("good bye", cs)
    if c:
        if option:
            alt_name = c.name + " (" + option + ")"
            all_pre_change = Creature.objects.filter(name=alt_name)
            if len(all_pre_change):
                for i in all_pre_change:
                    i.delete()
            c.id = None
            c.name = alt_name
            c.creature = option
            c.debuff()
            c.need_fix = True
            c.save()
        j = c.toJSON()
        k = json.loads(j)
        if idx > -1:
            k["idx"] = idx
        k["sire_name"] = c.sire_name
        from collector.utils.wod_reference import AUSPICES, BREEDS
        k["entrance"] = c.entrance
        k["auspice_name"] = AUSPICES[c.auspice]
        k["breed_name"] = BREEDS[c.breed]
        k["background_notes"] = c.background_notes()
        k["rite_notes"] = c.rite_notes()
        k["timeline"] = c.timeline()
        k["others"] = c.others()
        k["spe"] = c.get_specialities()
        k["shc"] = c.get_shortcuts()
        if c.creature == "kinfolk":
            k["edge_for"] = c.edge_for
        if len(c.specialities_rationale) > 0:
            k["srs"] = c.specialities_rationale
        tn = c.traits_notes()
        k["traits_notes"] = tn
        print(tn)
        chronicle = get_current_chronicle()
        if chronicle:
            k["chronicle_name"] = chronicle.name
        else:
            k["chronicle_name"] = "WaWWoD"
        k["nature_notes"] = c.nature_notes()
        k["meritsflaws_notes"] = c.meritsflaws_notes()
        j = json.dumps(k)
        if option is not None:
            c.delete()

    return j, k


def display_crossover_sheet(request, slug=None, option=None):
    if is_ajax(request):
        from collector.models.adventures import Adventure
        from collector.models.seasons import Season
        chronicle = get_current_chronicle()
        if chronicle:
            scenario = chronicle.scenario
            pre_title = chronicle.pre_title
            post_title = chronicle.post_title
            season = Season.current_season(chronicle.acronym)
            if season:
                print(season)
                adventure = Adventure.current_adventure(season.acronym)
                if adventure:
                    print(adventure)
                    post_title = adventure.adventure_teaser

        if slug is None:
            slug = 'julius_von_blow'
        j, k = character_for(slug, option)
        settings = {'version': 1.0, 'labels': STATS_NAMES[k["creature"]], 'pre_title': pre_title, 'scenario': scenario,
                    'post_title': post_title, 'fontset': FONTSET, 'blank': False, 'debug': False,
                    'specialities': k["spe"],
                    'shortcuts': k["shc"]}
        # print(settings['labels']['sheet'])
        crossover_sheet_context = {'settings': json.dumps(settings, sort_keys=True, indent=4), 'data': j}
        return JsonResponse(crossover_sheet_context)


def display_chronicle_map(request):
    # if is_ajax(request):
    chronicle = get_current_chronicle()
    creatures = Creature.objects.filter(chronicle=chronicle.acronym) \
        .exclude(mythic=True) \
        .exclude(condition__startswith="DEAD=19") \
        .exclude(condition__startswith="MISSING=19") \
        .exclude(ghost=True) \
        .exclude(hidden=True) \
        .filter(adventure="TWT") \
        .order_by('-is_player', 'faction', 'group', 'sire', 'adventure', 'creature', "name")
    all_creatures = []
    lines = []
    for creature in creatures:
        c = creature.toJSON()
        k = json.loads(c)
        k["edge_for"] = creature.edge_for
        k["sire"] = creature.sire
        k["is_player"] = creature.is_player
        k["entrance"] = creature.entrance
        # print(k["name"])
        all_creatures.append(k)
        lines.append(creature.extract_raw())

    txt_name = os.path.join(settings.MEDIA_ROOT, 'md/' + chronicle.acronym + "_cast.md")

    with open(txt_name, "w") as f:
        f.writelines(lines)
        f.close()

    context = {'data': json.dumps(all_creatures, indent=4, sort_keys=True)}
    return JsonResponse(context)


def display_dashboard(request):
    if is_ajax(request):
        gaia_wheel_context = {'data': build_gaia_wheel()}
        return JsonResponse(gaia_wheel_context)


def display_gaia_wheel(request):
    if is_ajax(request):
        gaia_wheel_context = {'data': build_gaia_wheel()}
        return JsonResponse(gaia_wheel_context)


def adventure_sheet(request):
    if is_ajax(request):
        adventure_sheet_context = {}
        chronicle = get_current_chronicle()
        data = {"players": [], "adventure": {}}
        if chronicle:
            idx = 0
            from collector.models.seasons import Season
            current_seasons = Season.objects.filter(chronicle=chronicle.acronym, current=True)
            for season in current_seasons:
                current_adventures = Adventure.objects.filter(season=season.acronym, current=True)
                for adventure in current_adventures:
                    if len(adventure.protagonists) > 0:
                        protagonists = adventure.protagonists.strip().split(",")
                        # print("PROTS", protagonists)
                        for rid in protagonists:
                            # print(rid)
                            if len(rid) > 0:
                                j, k = character_for(rid, None, idx)
                                idx += 1
                                data["players"].append(k)
            settings = {'fontset': FONTSET, 'labels': {'sheet': {"pages": 1}}}
            adv = {
                "name": chronicle.name,
                "acronym": chronicle.acronym,
                "full_id": "",
                "abstract": "",
                "date_str": "",
                "session_date_str": "",
                "gamemaster": "Zaffarelli",
                "experience": 0
            }

            data["adventure"] = adv

            adventure_sheet_context = {
                'settings': json.dumps(settings, sort_keys=True, indent=4),
                'data': json.dumps(data, sort_keys=True, indent=4)
            }

        return JsonResponse(adventure_sheet_context)


def display_lineage(request, slug=None):
    if is_ajax(request):
        if slug is None:
            data = build_per_primogen()
        else:
            # print(slug)
            data = build_per_primogen(slug)
        settings = {'fontset': FONTSET}
        lineage_context = {'settings': json.dumps(settings, sort_keys=True, indent=4), 'data': data}
        # print(lineage_context);
        return JsonResponse(lineage_context)


def display_sept(request, slug=None):
    if is_ajax(request):
        from collector.models.septs import Sept
        if slug is None:
            return HttpResponse(status=204)
        else:
            sept = Sept.objects.get(rid=slug)
            sept.need_fix = True
            sept.save()
            data = Sept.objects.get(rid=slug).build_sept()
            settings = {'fontset': FONTSET}
            sept_context = {'settings': json.dumps(settings, sort_keys=True, indent=4),
                            'data': json.dumps(data, sort_keys=True, indent=4)};
        return JsonResponse(sept_context)


def display_sept_rosters(request, slug=None):
    # if is_ajax(request):
    from collector.models.septs import Sept
    if slug is None:
        return HttpResponse(status=204)
    else:
        data = Sept.objects.get(rid=slug).build_sept()
        rid_stack = []
        for pack in data["packs"]:
            for m in pack["members"]:
                rid_stack.append(m['rid'])
        # print(rid_stack)
        lines = []
        for creature in Creature.objects.filter(rid__in=rid_stack).order_by('-rank'):
            c = creature.extract_raw()
            lines.append(c)

        return HttpResponse("\n".join(lines), content_type='text/plain', charset="utf-8")


@csrf_exempt
def save_to_svg(request, slug):
    response = {'status': 'error'}
    if is_ajax(request):
        svg_name = os.path.join(settings.MEDIA_ROOT, 'pdf/results/svg/' + request.POST["svg_name"])
        svgtxt = request.POST["svg"]
        with open(svg_name, "w") as f:
            f.write(svgtxt)
            f.close()
        response['status'] = 'ok'
    return JsonResponse(response)


@csrf_exempt
def svg_to_pdf(request, slug):
    response = {'status': 'error'}
    logger.info(f'Saving to PDF.')
    print('SAVE TO PDF')
    if is_ajax(request):
        import cairosvg
        svg_name = os.path.join(settings.MEDIA_ROOT, 'pdf/results/svg/' + request.POST["svg_name"])
        svgtxt = request.POST["svg"]
        creature = request.POST["creature"]
        if creature != "ADV_CREATURE":
            pages = STATS_NAMES[creature]["sheet"]["pages"]
        else:
            creature = "ADV_CREATURE"
            pages = 1
        with open(svg_name, "w") as f:
            f.write(svgtxt)
            f.close()
        logger.info(f'--> Created --> {svg_name}.')

        pdf_name = os.path.join(settings.MEDIA_ROOT, 'pdf/results/pdf/' + request.POST["pdf_name"])
        if "rid" in request.POST:
            rid = request.POST["rid"]
        else:
            rid = "adventure_sheet"
        cairosvg.svg2pdf(url=svg_name, write_to=pdf_name, scale=1.0, unsafe=True)
        logger.info(f'--> Created --> {pdf_name}.')
        print(f'--> Created --> {pdf_name}.')
        response['status'] = 'ok'
        all_in_one_pdf(rid, pages, creature)
        print(response)
    return JsonResponse(response)


@csrf_exempt
def all_in_one_pdf(rid, pages, creature="mortal"):
    # print(f'Starting PDFing for [{rid}].')
    logger.info(f'Starting PDFing for [{rid}].')
    res = []
    from PyPDF2 import PdfMerger
    media_results = os.path.join(settings.MEDIA_ROOT, 'pdf/results/pdf/')
    csheet_results = os.path.join(settings.MEDIA_ROOT, 'pdf/results/pdf/')
    onlyfiles = [f for f in os.listdir(media_results) if os.path.isfile(os.path.join(media_results, f))]
    pdfs = onlyfiles
    merger = PdfMerger()
    pdfs.sort()
    i = 0
    for pdf in pdfs:
        if pdf.startswith("character_sheet" + rid + "_p"):
            # print(pdf)
            merger.append(open(media_results + pdf, 'rb'))
            i += 1
    if i >= pages - 1:
        des = f'{csheet_results}character_sheet{rid}.pdf'
        with open(des, 'wb') as fout:
            merger.write(fout)
        logger.info(f'Successfully merged {i} page(s) as [{des}].')
        print(f'Successfully merged {i} page(s) as [{des}].')
    return res


def moon_phase(request, dt=None):
    weeks = []
    if dt is None:
        dt = datetime.date.today()
    firstday = datetime.date(dt.year, dt.month, 1)
    year = dt.year
    started = False
    day = 0
    cntw = 0
    out = False
    while cntw < 6:
        dow = 0
        aweek = []
        while dow < 7:
            cur_day = firstday + datetime.timedelta(days=day)
            # print(cur_day)
            if cur_day.month == firstday.month:
                # print("in month", cur_day, day)
                if not started:
                    # print("not started")
                    if firstday.weekday() == dow:
                        started = True
                    else:
                        # print("before month",cur_day, dow,cur_day.weekday() )
                        aweek.append({"str": "None", "num": "", "color": "#303030", "blank": True})
                if started:
                    import math
                    # print("started")
                    x = moon.phase(cur_day)
                    icons = ["Ragabash", "Theurge", "Philodox", "Galliard", "Ahroun", "Galliard", "Philodox", "Theurge"]
                    # if x < 3.5 * 1 - 0.01:
                    #     str = icons[0]
                    # if x < 3.5 * 2 - 0.01:
                    #     str = icons[1]
                    # elif x < 3.5 * 3 - 0.01:
                    #     str = icons[2]
                    # elif x < 3.5 * 4 - 0.01:
                    #     str = icons[3]
                    # elif x < 3.5 * 5 - 0.01:
                    #     str = icons[4]
                    # elif x < 3.5 * 6 - 0.01:
                    #     str = icons[5]
                    # elif x < 3.5 * 7 - 0.01:
                    #     str = icons[6]
                    # elif x < 3.5 * 8 - 0.01:
                    #     str = icons[7]
                    aa = int(x * 100)
                    ab = math.floor(aa / 350)
                    ac = ab - 1
                    str = icons[int(ac)]
                    col = "#909090"
                    if cur_day == datetime.date.today():
                        col = "#F0F0F0"
                    aweek.append({"str": f"{str}", "num": f"{cur_day.day:02}", "color": col, "blank": False})
                    day += 1
            else:
                txt = "out"
                if cur_day.weekday() == 0:
                    out = True
                    txt = "HERE"
                # print("after month", cur_day)
                aweek.append({"str": "None", "num": "", "color": "#303030", "blank": True})
                day += 1
            dow += 1
        # print(aweek)
        if out:
            cntw = 7
        else:
            weeks.append(aweek)
            cntw += 1

    return {"month": firstday.strftime("%B %Y"), "weeks": weeks}


def calendar(request, year=None):
    if year is None:
        year = 2024
    months = []
    for m in range(12):
        dt = datetime.date(year=int(year), month=m + 1, day=1)
        x = moon_phase(request, dt)
        months.append(x)

    context = prepare_index(request)
    context["calendar"] = months
    return render(request, 'collector/page/calendar.html', context=context)


def quaestor(request, slug=None):
    response = {}
    if is_ajax(request):
        from collector.utils.quaestor import Quaestor
        q = Quaestor()
        s, r, d = q.perform(slug)
        response["status"] = s
        response["rationale"] = r
        response["data"] = d
        print(response)
    return JsonResponse(response)


def weaver_code(request, code=None):
    def split_cumulate(v, show_colors=False):
        list = []
        stacked = []
        for p in powers:
            if p["power"] & v:
                stacked.append(p)
                # print(f"stacked... {p["power"]}")
        for s in stacked:
            for o in s["on"]:
                q = {
                    "x": o["x"] * defi["scaleX"] + defi["baseX"],
                    "y": o["y"] * defi["scaleY"] + defi["baseY"],
                    "color": s["color"] if show_colors else "#3030407f",
                }
                list.append(q)
        return list

    if code == '_':
        code = ""
        for a in "0123456789":
            code += f"{a}"
        code += "_"
        for a in "abcdefghijklmnopqrstuvwxyz".upper():
            code += f"{a}"
        code += "_"
    if code == '___':
        for a in range(128):
            code += f"{chr(a + 128)}"
        code += "_"
    if code == '_PATTERN_RULES_':

        t4p = "TOUCHER SUR 4 PATTES"
        t3p = "TOUCHER SUR 3 PATTES"
        t2p = "TOUCHER SUR 2 PATTES"
        t1p = "TOUCHER SUR 1 PATTE"
        t2f = "TOUCHER SUR 2 PIEDS"
        t1f = "TOUCHER SUR 1 PIED"
        fho = f"{chr(166)}"
        fgl = f"{chr(167)}"
        fcr = f"{chr(168)}"
        fhi = f"{chr(169)}"
        flu = f"{chr(170)}"
        relay = "RELAI"

        spots = [
            {"num": "28", "rule": t1p + fcr},
            {"num": "27", "rule": t2f + fgl},
            {"num": "26", "rule": t4p + fhi},
            {"num": "25", "rule": t3p + fcr},
            {"num": "24", "rule": t1f + fgl},
            {"num": "23", "rule": t2f + fgl},
            {"num": "22", "rule": t1f + fgl},
            {"num": "21", "rule": t3p + flu + relay},
            {"num": "20", "rule": t2f + fgl},
            {"num": "19", "rule": t2f + fho},
            {"num": "18", "rule": t3p + fcr},
            {"num": "17", "rule": t1p + fcr},
            {"num": "16", "rule": t4p + fhi},
            {"num": "15", "rule": t1f + fgl},
            {"num": "14", "rule": t2f + fgl + relay},
            {"num": "13", "rule": t1f + fho},
            {"num": "12", "rule": t2p + fcr},
            {"num": "11", "rule": t3p + fcr},
            {"num": "10", "rule": t1p + fcr},
            {"num": "9", "rule": t4p + fhi},
            {"num": "8", "rule": t2p + fcr},
            {"num": "7", "rule": t1f + fho + relay},
            {"num": "6", "rule": t4p + fcr},
            {"num": "5", "rule": t1f + fgl},
            {"num": "4", "rule": t3p + fhi},
            {"num": "3", "rule": t2f + fho},
            {"num": "2", "rule": t1f + fho},
            {"num": "1", "rule": t2f + fgl},
        ]
        code = "FORMES" + fho + fgl + fcr + fhi + flu
        for s in spots:
            code += "_"
            code += s["num"]
            code += s["rule"]
    if code == '__':
        code = ""
        code += chr(205)
        code += chr(239)
        code += chr(227)
        code += chr(240)
        code += chr(230)
    context = prepare_index(request)
    defi = {
        "x": [1, 2, 3],
        "y": [1, 2, 3, 4],
        "scaleX": 10,
        "scaleY": 10,
        "baseX": 5,
        "baseY": 5,
        "oX": [],
        "oY": [],
        "debug": 0
    }

    special_names = {
        "166": "Homid",
        "167": "Glabro",
        "168": "Crinos",
        "169": "Hispo",
        "170": "Lupus",
        "205": "GANUR LATH",
        "239": "GABRA O-L",
        "227": "FURIAS TDP",
        "240": "HURLUS LASDG",
        "230": "CORIALIS G-C",
    }

    for d in defi["x"]:
        a = d * defi["scaleX"] + defi["baseX"]
        defi["oX"].append(a)
    for d in defi["y"]:
        a = d * defi["scaleY"] + defi["baseY"]
        defi["oY"].append(a)
    powers = [
        {
            "power": 1,
            "on": [{"x": 2, "y": 2}],
            "color": "red"
        },
        {
            "power": 2,
            "on": [{"x": 1, "y": 3}, {"x": 3, "y": 2}],
            "color": "orange"
        },
        {
            "power": 4,
            "on": [{"x": 1, "y": 2}, {"x": 3, "y": 3}],
            "color": "green"
        },
        {
            "power": 8,
            "on": [{"x": 1, "y": 4}, {"x": 3, "y": 1}],
            "color": "purple"
        },
        {
            "power": 16,
            "on": [{"x": 1, "y": 1}, {"x": 3, "y": 4}],
            "color": "blue"
        },
        {
            "power": 32,
            "on": [{"x": 2, "y": 1}],
            "color": "brown"
        },
        {
            "power": 64,
            "on": [{"x": 2, "y": 3}],
            "color": "cyan"
        },
        {
            "power": 128,
            "on": [{"x": 2, "y": 4}],
            "color": "fuchsia"
        }
    ]
    # numbers = []
    # letters = []
    combos = []
    # for x in range(10):
    #     numbers.append({"value": x + 32, "on": [], "letter": f"{x}"})
    # for x in range(26):
    #     letters.append({"value": x + 65, "on": [], "letter": ""})
    complete_code = code
    l = []
    all_words = complete_code.split("_")
    for word in all_words:
        combos = []
        for y in word:
            x = ord(y)
            if x > 127:
                z = x
                rune = {"value": z, "on": [], "letter": f"{chr(z)} {z}", "is_special": 1, "stroke": "#3030a0"}
                if f"{z}" in special_names:
                    rune["letter"] = special_names[f"{z}"]
                print("Special " + chr(230))
            elif x in [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]:
                z = x - 48
                rune = {"value": z, "on": [], "letter": f"{z}", "is_number": 1, "stroke": "#30a030"}
                print("Number")
            else:
                z = x
                rune = {"value": z, "on": [], "letter": f"{chr(z)}", "is_letter": 1, "stroke": "#a03030"}
                print("Letter")
            print(f"x:{x} y:{y} z:{z}")
            rune["on"] = split_cumulate(z, defi["debug"] > 0)
            combos.append(rune)
        l.append(combos)
    for p in powers:
        q = split_cumulate(p["power"], defi["debug"] > 0)
        p['on'] = q
        p['letter'] = p["power"]

    context["weaver_code"] = {"defi": defi, "powers": powers, "combos": l}
    return render(request, 'collector/page/weaver_code.html', context=context)
