from django.db import models
from django.contrib import admin
from storytelling.models.stories import Story
from storytelling.models.places import Place
from datetime import datetime, timedelta
from collector.utils.helper import json_default
import json
import logging

logger = logging.Logger(__name__)


class Scene(models.Model):
    class Meta:
        ordering = ['time_offset_hours']
    name = models.CharField(max_length=128, default='')
    story = models.ForeignKey(Story, on_delete=models.SET_NULL, null=True)
    place = models.ForeignKey(Place, on_delete=models.SET_NULL, null=True)
    time_offset_hours = models.IntegerField(default=-1, blank=True)
    time_offset_custom = models.CharField(default='', max_length=32, blank=True)
    day = models.DateTimeField(default=datetime.now,blank=True,null=True)
    place_order = models.PositiveIntegerField(default=0, blank=True)
    tags = models.TextField(max_length=256, blank=True, default='')
    exact_place = models.CharField(max_length=256, blank=True, default='')
    preamble = models.TextField(max_length=1024, blank=True, default='')
    objectives = models.TextField(max_length=1024, blank=True, default='')
    fallback = models.TextField(max_length=1024, blank=True, default='')
    description = models.TextField(max_length=4096, blank=True, default='')
    rewards = models.TextField(max_length=1024, blank=True, default='')
    consequences = models.TextField(max_length=1024, blank=True, default='')
    cast = models.TextField(max_length=1024, blank=True, default='')
    # era = models.CharField(max_length=16, blank=True, default='2019')
    is_event = models.BooleanField(default=False)
    is_downtime = models.BooleanField(default=False)
    is_briefing = models.BooleanField(default=False)
    is_debriefing = models.BooleanField(default=False)

    def fix(self):
        if self.time_offset_hours >= 0:
            self.time_offset_custom = f'{int(self.time_offset_hours/24)} {self.time_offset_hours%24}'
        else:
            words = self.time_offset_custom.split(' ')
            if len(words) == 2:
                self.time_offset_hours = int(words[0])*24+int(words[1])
            else:
                self.time_offset_hours = -1
            if self.time_offset_hours < -1:
                self.time_offset_hours = -1
                self.time_offset_custom = ''
        # Update orders in and out of the scenes
        from_list = ScenesLink.objects.filter(scene_from=self)
        to_list = ScenesLink.objects.filter(scene_to=self)
        n = 0
        for l in from_list:
            l.order_out = n
            n += 1
            l.save()
        n = 0
        for l in to_list:
            l.order_in = n
            n += 1
            l.save()

    def toJSON(self):
        jstr = json.dumps(self, default=json_default, sort_keys=True, indent=4)
        return jstr

    def __str__(self):
        st = ''
        if self.story is not None:
            st = self.story.acronym
        return f'{self.name}'

    @property
    def links_from(self):
        list = []
        from_list = ScenesLink.objects.filter(scene_from=self)
        for l in from_list:
            list.append(f'<b> H{l.scene_to.time_offset_hours}-{l.scene_to.name}</b> [{l.get_category_display()}]')
        return ", ".join(list)

    @property
    def links_to(self):
        list = []
        to_list = ScenesLink.objects.filter(scene_to=self)
        for l in to_list:
            list.append(f'<b>H{l.scene_from.time_offset_hours}-{l.scene_from.name}</b> [{l.get_category_display()}]')
        return ", ".join(list)

    @property
    def story_time(self):
        d = None
        if self.story:
            refdatetime = datetime.combine(self.story.dday, datetime.min.time())
            d = refdatetime + timedelta(hours=self.time_offset_hours)
        return d

    @property
    def verified_cast(self):
        if self.cast == '':
            return ""
        else:
            from collector.models.creatures import Creature
            cast = self.cast.split(', ')
            cast_list = Creature.objects.filter(rid__in=cast)
            list = []
            for c in cast_list:
                list.append(c.name)
            strl = ", ".join(list)
            return f'Expected: {len(cast)}, found {len(list)}: {strl}'

    @property
    def ultimate_cast(self):
        if self.cast == '':
            return ""
        else:
            from collector.models.creatures import Creature
            cast = self.cast.split(', ')
            cast_list = Creature.objects.filter(rid__in=cast)
            list = []
            for c in cast_list:
                list.append('<b>'+c.name+'</b> ['+c.storyteller_entrance+']')
            strl = ", ".join(list)
            if len(cast) == len(list):
                return f'{strl}'
            else:
                return f'Expected: {len(cast)}, found {len(list)}: {strl} [{self.cast}]'


    @property
    def all_as_tags(self):
        list = self.tags.split(" ")
        if self.is_downtime:
            list.append("DOWNTIME")
        if self.is_event:
            list.append("EVENT")
        if self.is_briefing:
            list.append("INTRODUCTION")
        if self.is_debriefing:
            list.append("DEBRIEFING")
        return " ".join(list)


def refix(modeladmin, request, queryset):
    for scene in queryset:
        scene.fix()
        scene.save()
    short_description = 'Fix scenes'




LINK_CATEGORIES = (
    ('FOE', 'Enemies actions'),
    ('FRIEND', 'Allies actions'),
    ('THIRD', 'Others actions'),
    ('TIME', '-'),
    ('FATE', 'Fate or ill luck'),
)


class ScenesLink(models.Model):
    class Meta:
        ordering = ['category', 'scene_from', 'scene_to']
    category = models.CharField(default='TIME', max_length=10, choices=LINK_CATEGORIES)
    description = models.TextField(max_length=1024, default='', blank=True)
    scene_from = models.ForeignKey(Scene, on_delete=models.CASCADE, related_name='scenefrom', null=True)
    scene_to = models.ForeignKey(Scene, on_delete=models.CASCADE, related_name='sceneto', null=True)
    valid = models.BooleanField(default=True)
    order_in = models.IntegerField(default=0, blank=True)
    order_out = models.IntegerField(default=0, blank=True)

    def __str__(self):
        return f'{self.scene_from.name} [{self.category}] {self.scene_to.name}'


class SceneFromInline(admin.TabularInline):
    model = ScenesLink
    extras = 3
    fk_name = 'scene_from'
    ordering = ('scene_to',)


class SceneToInline(admin.TabularInline):
    model = ScenesLink
    extras = 3
    fk_name = 'scene_to'
    ordering = ('scene_from',)


class SceneAdmin(admin.ModelAdmin):
    list_display = ['name', 'place', 'place_order', 'time_offset_hours', 'story_time', 'links_to', 'links_from', 'verified_cast']
    ordering = ['time_offset_hours', 'place', 'name']
    list_filter = ['story', 'place']
    search_fields = ['name', 'description', 'preamble', 'rewards', 'consequences']
    actions = [refix]
    inlines = [SceneFromInline, SceneToInline]
