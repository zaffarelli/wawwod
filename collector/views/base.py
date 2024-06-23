from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import render, get_object_or_404
from collector.models.creatures import Creature
from storytelling.models.cities import City
from django.core.paginator import Paginator
from django.template.loader import get_template
from django.views.decorators.csrf import csrf_exempt
from collector.templatetags.wod_filters import as_bullets
from collector.utils.data_collection import build_per_primogen, build_gaia_wheel
from collector.utils.wod_reference import get_current_chronicle
from collector.models.chronicles import Chronicle
from collector.utils.wod_reference import STATS_NAMES, CHARACTERS_PER_PAGE
import json
from collector.utils.wod_reference import FONTSET
from collector.utils.data_collection import improvise_id
from django.contrib.auth.decorators import login_required
from django.conf import settings
from collector.utils.helper import is_ajax
import os
import logging

logger = logging.Logger(__name__)
chronicle = get_current_chronicle()


def prepare_index(request):
    chronicles = []
    players = []
    cities = []
    plist = Creature.objects.filter(chronicle=chronicle.acronym).exclude(player='').exclude(
        adventure_id__isnull=True).order_by('adventure')
    print(plist)
    adv = None
    for p in plist:
        if p.adventure != adv:
            adv = p.adventure
            adventure = {'adventure': p.adventure.name, 'players': []}
            players.append(adventure)
        adventure['players'].append({'name': p.name, 'rid': p.rid, 'player': p.player, 'pre_change_access':p.pre_change_access})

    for c in Chronicle.objects.all():
        chronicles.append({'name': c.name, 'acronym': c.acronym, 'active': c.is_current})
    for ci in City.objects.all():
        tag = ci.name.replace(' ', '_')
        cities.append({'name': ci.name, 'tag': tag.lower()})
    misc = {"version":settings.VERSION}
    context = {'chronicles': chronicles, 'fontset': FONTSET, 'players': players, 'cities': cities, 'miscellaneous': misc}
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
    print(slug)
    print(chronicle.acronym)
    if is_ajax(request):
        if 'vtm' == slug:
            print('vampires')
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['ghoul', 'kindred']) \
                .order_by('family', 'name')
        elif 'mta' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['mage']) \
                .order_by('name')
        elif 'wta' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['garou', 'kinfolk']) \
                .order_by('name')
        elif 'ctd' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['changeling']) \
                .order_by('name')
        elif 'wto' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['wraith']) \
                .order_by('name')
        elif 'mor' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['mortal']) \
                .order_by('name')
        elif 'new' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, is_new=True).order_by('name')
        elif 'bal' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, status__in=["UNBALANCED","OK+"],
                                                     hidden=False).order_by('creature',
                                                                                                      '-expectedfreebies')
        elif 'pen' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, faction='Pentex',
                                                     creature__in=['garou', 'kinfolk', 'fomori']).order_by('name')
        elif 'ccm' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['mortal', 'ghoul', 'kinfolk', 'fomori']).order_by('name')
        elif 'ccs' == slug:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym, creature__in=['garou', 'kindred', 'wraith', 'changeling', 'mage']).order_by('name')
        else:
            creature_items = Creature.objects.filter(chronicle=chronicle.acronym).order_by('groupspec','player','name')
        paginator = Paginator(creature_items, CHARACTERS_PER_PAGE)
        creature_items = paginator.get_page(pid)
        list_context = {'creature_items': creature_items}
        list_template = get_template('collector/list.html')
        list_html = list_template.render(list_context)
        answer = {
            'list': list_html,
        }
        # print(answer)
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


def add_kindred(request, slug=None):
    if is_ajax(request):
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


def display_crossover_sheet(request, slug=None, option=None):
    if is_ajax(request):
        chronicle = get_current_chronicle()
        if slug is None:
            slug = 'julius_von_blow'
        c = Creature.objects.get(rid=slug)
        if option:
            alt_name = c.name + " ("+option+")"
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
        if chronicle:
            scenario = chronicle.scenario
            pre_title = chronicle.pre_title
            post_title = chronicle.post_title
        spe = c.get_specialities()
        shc = c.get_shortcuts()
        j = c.toJSON()
        k = json.loads(j)
        k["sire_name"] = c.sire_name
        k["background_notes"] = c.background_notes()
        k["rite_notes"] = c.rite_notes()
        k["timeline"] = c.timeline()
        tn = c.traits_notes()
        #print(tn)
        k["traits_notes"] = tn
        k["nature_notes"] = c.nature_notes()
        k["meritsflaws_notes"] = c.meritsflaws_notes()
        # print("DISCPLINES NOTES ---> ", k["disciplines_notes"])
        j = json.dumps(k)
        if option is not None:
            c.delete()
        settings = {'version': 1.0, 'labels': STATS_NAMES[c.creature], 'pre_title': pre_title, 'scenario': scenario,
                    'post_title': post_title, 'fontset': FONTSET, 'specialities': spe, 'shortcuts': shc}
        crossover_sheet_context = {'settings': json.dumps(settings, sort_keys=True, indent=4), 'data': j}

        return JsonResponse(crossover_sheet_context)


def display_gaia_wheel(request):
    if is_ajax(request):
        gaia_wheel_context = {'data': build_gaia_wheel()}
        return JsonResponse(gaia_wheel_context)


def display_dashboard(request):
    if is_ajax(request):
        gaia_wheel_context = {'data': build_gaia_wheel()}
        return JsonResponse(gaia_wheel_context)


def display_lineage(request, slug=None):
    if is_ajax(request):
        if slug is None:
            data = build_per_primogen()
        else:
            # print(slug)
            data = build_per_primogen(slug)
        settings = {'fontset': FONTSET}
        lineage_context = {'settings': json.dumps(settings, sort_keys=True, indent=4), 'data': data};
        # print(lineage_context);
        return JsonResponse(lineage_context)


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
    if is_ajax(request):
        import cairosvg
        svg_name = os.path.join(settings.MEDIA_ROOT, 'pdf/results/svg/' + request.POST["svg_name"])
        svgtxt = request.POST["svg"]
        with open(svg_name, "w") as f:
            f.write(svgtxt)
            f.close()
        logger.info(f'--> Created --> {svg_name}.')
        pdf_name = os.path.join(settings.MEDIA_ROOT, 'pdf/results/pdf/' + request.POST["pdf_name"])
        rid = request.POST["rid"]
        cairosvg.svg2pdf(url=svg_name, write_to=pdf_name, scale=1.0)
        logger.info(f'--> Created --> {pdf_name}.')
        response['status'] = 'ok'
        all_in_one_pdf(rid)
    return JsonResponse(response)


@csrf_exempt
def all_in_one_pdf(rid):
    logger.info(f'Starting PDFing for [{rid}].')
    res = []
    from PyPDF2 import PdfMerger
    media_results = os.path.join(settings.MEDIA_ROOT, 'pdf/results/pdf/')
    csheet_results = os.path.join(settings.MEDIA_ROOT, 'pdf/results/csheet/')
    onlyfiles = [f for f in os.listdir(media_results) if os.path.isfile(os.path.join(media_results, f))]
    pdfs = onlyfiles
    merger = PdfMerger()
    pdfs.sort()
    i = 0
    for pdf in pdfs:
        if pdf.startswith("character_sheet" + rid):
            # print(pdf)
            merger.append(open(media_results + pdf, 'rb'))
            i += 1
    if i > 3:
        des = f'{csheet_results}character_sheet{rid}.pdf'
        with open(des, 'wb') as fout:
            merger.write(fout)
        logger.info(f'Successfully merged {i + 1} pages as [{des}].')
    return res
