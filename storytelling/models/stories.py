from django.db import models
from django.contrib import admin
from collector.models.chronicles import Chronicle
from collector.utils.helper import json_default
from datetime import datetime
import json

import logging

logger = logging.Logger(__name__)


class Story(models.Model):
    class Meta:
        verbose_name_plural = 'stories'

    name = models.CharField(max_length=128, default='')
    acronym = models.CharField(max_length=16, default='')
    chronicle = models.ForeignKey(Chronicle, on_delete=models.SET_NULL, null=True)
    description = models.TextField(max_length=1024, blank=True, default='')
    dday = models.DateTimeField(default=datetime.now, blank=True, null=True)
    is_current = models.BooleanField(default=False)

    @property
    def story_end_time(self):
        from storytelling.models.scenes import Scene
        all = Scene.objects.filter(story=self)
        end_time = 0
        for s in all:
            if s.time_offset_hours > end_time:
                end_time = s.time_offset_hours
        return end_time

    @property
    def all_timelines(self):
        timelines = []
        cnt = 0
        timeline = 'sdfssqsf'
        for s in self.scene_set.all().order_by('timeline'):
            if s.timeline != timeline:
                timeline = s.timeline
                cnt += 1
                timelines.append({'id': cnt, 'label': s.timeline, 'name': f'timeline{cnt}'})
        return timelines



    @property
    def all_places(self):
        from storytelling.models.places import Place
        from storytelling.models.scenes import Scene
        list = []
        all = Place.objects.filter(story=self).order_by('-importance')
        for p in all:
            p_scenes = Scene.objects.filter(place=p).order_by('time_offset_hours')

            day = -5
            for s in p_scenes:
                new_day = int(s.time_offset_hours/(24*7*10))
                if new_day != day:
                    day = new_day
                    po = 1
                s.place_order = po
                s.save()
                po += 1
                if po > 5:
                    po = 1
            list.append({'name': p.name, 'id': p.id, 'acronym': p.acronym, 'scenes_count': len(p_scenes), 'description': p.description})
        return list

    @property
    def all_scenes(self):
        from storytelling.models.scenes import Scene
        list = []
        all = Scene.objects.filter(story=self).order_by('timeline', 'time_offset_hours')
        for s in all:
            list.append({'name': s.name, 'id': s.id, 'time': s.time_offset_hours, 'place': s.place.id, 'timeline': s.timeline, 'external_links': s.external_links,
                         'place_order': s.place_order, 'is_event': s.is_event,'is_downtime': s.is_downtime, 'story_time': s.story_time})
        return list

    @property
    def all_links(self):
        from storytelling.models.scenes import ScenesLink
        list = []
        all = ScenesLink.objects.filter(scene_from__story=self, scene_to__story=self)
        for s in all:
            list.append({'category': s.category, 'id': s.id, 'scene_from': s.scene_from.id, 'scene_to': s.scene_to.id,
                         'description': s.description, 'valid': s.valid,
                         'order_in': s.order_in, 'order_out': s.order_out})
        return list

    def toJSON(self):
        jstr = json.dumps(self, default=json_default, sort_keys=True, indent=4)
        return jstr

    def __str__(self):
        ch = ''
        if self.chronicle is not None:
            ch = self.chronicle.name
        return f'{self.name} ({ch})'

    @property
    def all_cast(self):
        from storytelling.models.scenes import Scene
        lst = []
        all_scenes = Scene.objects.filter(story=self).order_by('timeline', 'time_offset_hours')
        for scene in all_scenes:
            scene_list = scene.cast.split(',')
            lst.extend(scene_list)
        lst.sort()
        return list(set(lst))

    @property
    def all_cast_str(self):
        return " ".join(self.all_cast)

    @property
    def calendar(self):
        from storytelling.models.scenes import Scene
        import calendar
        scene_list = []
        all_scenes = Scene.objects.filter(story=self).order_by('time_offset_hours')
        current_day = 0
        for scene in all_scenes:
            # tags = scene.tags
            # if scene.is_briefing:
            #     tags += ' BRIEFING'
            # if scene.is_debriefing:
            #     tags += ' DEBRIEFING'
            # if scene.is_event:
            #     tags += ' EVENT'
            # if scene.is_downtime:
            #     tags += ' DOWNTIME'
            # all_tags = tags.strip().rstrip().split(' ')
            # pretty_tags = ''
            # for t in all_tags:
            #     pretty_tags += f'<div class="tag">[{t}]</div> '
            if current_day == 0:
                current_day = scene.time_offset_custom.split(" ")[0]
                scene_list.append(f"<tr><th colspan=4>{calendar.day_name[scene.story_time.weekday()]} {scene.story_time.date()}</th></tr>")
            if current_day == scene.time_offset_custom.split(" ")[0]:
                scene_list.append(f"<tr><td width='3cm'>{scene.name}<br/>{scene.all_as_tags}</td><td width='3cm'>{scene.timeline}</td><td width='2cm'>{scene.place.acronym}</td><td width='1cm'>{scene.time_offset_hours % 24}h00</td></tr>")
            else:
                current_day = scene.time_offset_custom.split(" ")[0]
                scene_list.append(f"<tr><th colspan=4>{calendar.day_name[scene.story_time.weekday()]} {scene.story_time.date()}</th></tr>")
        txt = "<center><table width='8cm' class='calendar'>"+"".join(scene_list)+"</table></center>"
        return txt


class StoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'acronym','chronicle', 'dday', 'description', 'all_cast_str', 'is_current']
    ordering = ['dday', 'name']
    list_filter = ['dday', 'chronicle']
    search_fields = ['name', 'description']
