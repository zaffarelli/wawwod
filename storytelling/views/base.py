from django.http import JsonResponse, HttpResponse
from django.template.loader import get_template
from django.shortcuts import render
from xhtml2pdf import pisa
from io import BytesIO
from storytelling.models.stories import Story
from storytelling.models.scenes import Scene
from collector.utils.helper import json_default, is_ajax
from django.views.decorators.csrf import csrf_exempt
import os
import json


def display_storytelling(request):
    all = Story.objects.all()
    all_stories = []
    settings = {}
    selected_story = None
    for s in all:
        if s.is_current:
            all_stories.append(s.toJSON())
            selected_story = s
    settings_json = json.dumps(settings, default=json_default, sort_keys=True, indent=4)
    places_json = json.dumps(selected_story.all_places, default=json_default, sort_keys=True, indent=4)
    scenes_json = json.dumps(selected_story.all_scenes, default=json_default, sort_keys=True, indent=4)
    links_json = json.dumps(selected_story.all_links, default=json_default, sort_keys=True, indent=4)
    timelines_json = json.dumps(selected_story.all_timelines, default=json_default, sort_keys=True, indent=4)
    data = {'story': selected_story.toJSON(), 'end_time': selected_story.story_end_time, 'places': places_json,
            'scenes': scenes_json, 'links': links_json, 'timelines': timelines_json}
    data_json = json.dumps(data, default=json_default, sort_keys=True, indent=4)
    answer = {'data': data_json, 'settings': settings_json}
    return JsonResponse(answer)


def action_timeslip(request, slug='m0d_m0h__'):
    targets = slug.split('__')[1]
    # print(targets)
    times = slug.split('__')[0]
    times_off = times.split('_')
    # print(times_off)
    total_offset = 0
    for t in times_off:
        # print(t)
        offset = int(t[1])
        if t[0] == 'm':
            offset *= -1
        if t[2] == 'd':
            offset *= 24
        total_offset += offset
    scenes = targets.split('_')
    # print(f'Time offset: {total_offset}')
    changes = []
    for s in scenes:
        print(scenes)
        obj = Scene.objects.get(pk=int(s))
        if obj is not None:
            obj.time_offset_hours += total_offset
            obj.fix()
            obj.save()
            changes.append({'id': obj.id, 'time': obj.time_offset_hours, 'story_time': obj.story_time})
    changes_json = json.dumps(changes, default=json_default, sort_keys=True, indent=4)
    answer = {'changes_on_scenes': changes_json}
    return JsonResponse(answer)


def display_pdf_story(request):
    from collector.models.creatures import Creature
    all = Story.objects.all()
    all_stories = []
    settings = {}
    selected_story = None
    for s in all:
        if s.is_current:
            all_stories.append(s.toJSON())
            selected_story = s
    full_cast = []
    casted = Creature.objects.filter(rid__in=selected_story.all_cast).order_by('faction', '-freebies', 'family', '-background3','name')
    #casted = Creature.objects.filter(chronicle="HbN", player="", status__in=["OK"],hidden=False, creature__in=["kindred","ghoul","mortal"]).order_by('faction','-freebies', 'family', 'groupspec', 'group')
    for c in casted:
        full_cast.append(c)
    # print(full_cast)
    data = {'story': selected_story, 'end_time': selected_story.story_end_time, 'places': selected_story.all_places,
            'scenes': selected_story.all_scenes, 'links': selected_story.all_links,
            'timelines': selected_story.all_timelines, 'full_cast': full_cast}
    context = {'data': data, 'settings': settings, 'filename': selected_story.name.lower()}
    # print(context)
    template = get_template("storytelling/pdf/story.html")
    html = template.render(context)
    result = BytesIO()
    # pdf = pisa.pisaDocument(BytesIO(html.encode('utf-8')), result)
    # if not pdf.err:
    #     response = HttpResponse(result.getvalue(), content_type='application/pdf')
    #     filename = 'avatar_%s.pdf' % context['filename']
    #     content = "inline; filename='%s'" % filename
    #     response['content-disposition'] = content
    #     return response
    filename = 'story_%s.pdf' % context['filename']

    # fname = os.path.join(settings.MEDIA_ROOT, 'pdf/results/' + filename)
    fname = os.path.join('wawwod_media/', 'pdf/results/' + filename)
    es_pdf = open(fname, 'wb')
    pdf = pisa.pisaDocument(BytesIO(html.encode('utf-8')), es_pdf)
    if not pdf.err:
        es_pdf.close()
        return HttpResponse(status=204)
    return HttpResponse(pdf.err, content_type='text/plain')


@csrf_exempt
def update_scene(request, id: None, field: None):
    if is_ajax(request):
        answer = {'error': 'bad_id'}
        if id:
            print(id, field)
            scene = Scene.objects.get(pk=id)
            print(getattr(scene, field))
            answer = {'error': 'bad_scene'}
            if getattr(scene, field) is not None:
                value = request.POST['text']
                setattr(scene, field, value)
                scene.save()
                changes = {'field': 'field_' + id + '__' + field, 'value': value}
                changes_json = json.dumps(changes, default=json_default, sort_keys=True, indent=4)
                answer = {'changes_on_scenes': changes_json}
    return JsonResponse(answer)


def display_map(request, slug=None):
    from collector.utils.data_collection import get_districts
    response = {'html': '', 'data': {}}
    if is_ajax(request):
        if not slug:
            slug = 'munich'
        x = slug.replace('_', ' ')
        context = get_districts(x)
        response['data'] = context
    return JsonResponse(response)


# def show_munich(request):
#     context = {}
#     return render(request, 'storytelling/geojson.html')
