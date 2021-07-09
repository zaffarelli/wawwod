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
    def all_places(self):
        from storytelling.models.places import Place
        from storytelling.models.scenes import Scene
        list = []
        all = Place.objects.filter(story=self).order_by('-importance')
        for p in all:
            p_scenes = Scene.objects.filter(place=p).order_by('time_offset_hours')

            day = -5
            for s in p_scenes:
                new_day = int(s.time_offset_hours/24)
                if new_day != day:
                    day = new_day
                    po = 1
                s.place_order = po
                s.save()
                po += 1
            list.append({'name': p.name, 'id': p.id, 'acronym': p.acronym, 'scenes_count': len(p_scenes)})
        return list

    @property
    def all_scenes(self):
        from storytelling.models.scenes import Scene
        list = []
        all = Scene.objects.filter(story=self)
        for s in all:
            list.append({'name': s.name, 'id': s.id, 'time': s.time_offset_hours, 'place': s.place.id,
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


class StoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'acronym','chronicle', 'dday', 'description', 'is_current']
    ordering = ['dday', 'name']
    list_filter = ['dday', 'chronicle']
    search_fields = ['name', 'description']
