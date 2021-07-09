from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import render, get_object_or_404
from collector.models.creatures import Creature
from django.core.paginator import Paginator
from django.template.loader import get_template
from django.views.decorators.csrf import csrf_exempt
from collector.templatetags.wod_filters import as_bullets
from collector.utils.data_collection import build_per_primogen, build_gaia_wheel
from collector.utils.wod_reference import get_current_chronicle
from collector.models.chronicles import Chronicle
from collector.utils.wod_reference import STATS_NAMES
import json
from collector.utils.wod_reference import FONTSET
from collector.utils.data_collection import improvise_id

chronicle = get_current_chronicle()


def prepare_index(request):
    chronicles = []
    players = []
    plist = Creature.objects.filter(chronicle=chronicle.acronym).exclude(player='')
    for p in plist:
        players.append({'name': p.name, 'rid': p.rid, 'player': p.player})
    print(players)
    for c in Chronicle.objects.all():
        chronicles.append({'name': c.name, 'acronym': c.acronym, 'active': c == chronicle})
    context = {'chronicles': chronicles, 'fontset': FONTSET, 'players': players}
    return context


def index(request):
    context = prepare_index(request)
    return render(request, 'collector/index.html', context=context)


def change_chronicle(request, slug=None):
    if request.is_ajax:
        from collector.utils.wod_reference import set_chronicle
        set_chronicle(slug)
        context = prepare_index(request)
        return render(request, 'collector/index.html', context=context)


def get_list(request, pid=1, slug=None):
    print(slug)
    print(chronicle.acronym)
    if request.is_ajax:
        if 'vtm' == slug:
            print('vampires')
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['ghoul', 'kindred'])\
                .order_by('name')
        elif 'mta' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['mage'])\
                .order_by('name')
        elif 'wta' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['garou', 'kinfolk'])\
                .order_by('name')
        elif 'ctd' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['changeling'])\
                .order_by('name')
        elif 'wto' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['wraith'])\
                .order_by('name')
        elif 'mor' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['mortal'])\
                .order_by('name')
        elif 'new' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, is_new=True).order_by('name')
        elif 'pen' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, faction='Pentex',
                                                     creature__in=['garou', 'kinfolk', 'fomori']).order_by('name')
        else:
            creature_items = Creature.objects.all().filter(chronicle=chronicle.acronym).order_by('name')
        paginator = Paginator(creature_items, 25)
        creature_items = paginator.get_page(pid)
        list_context = {'creature_items': creature_items}
        list_template = get_template('collector/list.html')
        list_html = list_template.render(list_context)
        answer = {
            'list': list_html,
        }
        print(answer)
        return JsonResponse(answer)
    else:
        return HttpResponse(status=204)


@csrf_exempt
def updown(request):
    if request.is_ajax():
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
    if request.is_ajax():
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
    if request.is_ajax:
        
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


def add_kindred(request, slug=None):
    if request.is_ajax:
        name = " ".join(slug.split("_"))
        chronicle = get_current_chronicle()
        item = Creature()
        item.name = name
        item.chronicle = chronicle.acronym
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
        return HttpResponse(status=204)


def add_ghoul(request, slug=None):
    if request.is_ajax:
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
                item.age = random.randrange(0,19)+20
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


def display_crossover_sheet(request, slug=None):
    if request.is_ajax:
        chronicle = get_current_chronicle()
        if slug is None:
            slug = 'julius_von_blow'
        c = Creature.objects.get(rid=slug)

        if chronicle.acronym == 'BAV':
            scenario = "Bayerische Nächte"
            pre_title = 'Munich'
            post_title = "Oktoberfest, 2019"
        else:
            pre_title = 'World of Darkness'
            scenario = "NEW YORK CITY"
            post_title = "feat. Julius Von Blow"
        spe = c.get_specialities()
        shc = c.get_shortcuts()
        j = c.toJSON()
        k = json.loads(j)
        k["sire_name"] = c.sire_name
        j = json.dumps(k)
        settings = {'version': 1.0, 'labels': STATS_NAMES[c.creature], 'pre_title': pre_title, 'scenario': scenario, 'post_title': post_title, 'fontset': FONTSET, 'specialities': spe, 'shortcuts': shc}
        crossover_sheet_context = {'settings': json.dumps(settings, sort_keys=True, indent=4), 'data': j}

        return JsonResponse(crossover_sheet_context)


def display_gaia_wheel(request):
    if request.is_ajax:
        gaia_wheel_context = {'data': build_gaia_wheel()}
        return JsonResponse(gaia_wheel_context)


def display_lineage(request, slug=None):
    if request.is_ajax:
        if slug is None:
            data = build_per_primogen()
        else:
            print(slug)
            data = build_per_primogen(slug)
        lineage_context = {'data': data}
        return JsonResponse(lineage_context)

