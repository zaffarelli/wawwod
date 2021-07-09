from django.http import JsonResponse, HttpResponse
from storytelling.models.stories import Story
from storytelling.models.scenes import Scene
from collector.utils.helper import json_default
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
    data = {'story': selected_story.toJSON(), 'end_time': selected_story.story_end_time, 'places': places_json, 'scenes': scenes_json, 'links': links_json}
    data_json = json.dumps(data, default=json_default, sort_keys=True, indent=4)
    answer = {'data': data_json, 'settings': settings_json}
    return JsonResponse(answer)


def action_timeslip(request, slug='m0d_m0h__'):
    targets = slug.split('__')[1]
    print(targets)
    times = slug.split('__')[0]
    times_off = times.split('_')
    print(times_off)
    total_offset = 0
    for t in times_off:
        print(t)
        offset = int(t[1])
        if t[0] == 'm':
            offset *= -1
        if t[2] == 'd':
            offset *= 24
        total_offset += offset
    scenes = targets.split('_')
    print(f'Time offset: {total_offset}')
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
