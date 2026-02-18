from django.urls import re_path
from storytelling.views.base import display_pdf_story, display_storytelling, action_timeslip, update_scene, display_map, \
    chronicle_book, story_book
from storytelling.views.scene import SceneDetailView, SceneUpdateView

urlpatterns = [
    re_path(r'^ajax/display/storytelling/$', display_storytelling, name='display_storytelling'),
    re_path(r'^ajax/display/story_book/$', story_book, name='story_book'),
    re_path(r'^ajax/edit/scene/(?P<pk>\d+)/$', SceneUpdateView.as_view(), name='edit_scene'),
    re_path(r'^ajax/view/scene/(?P<pk>\d+)/$', SceneDetailView.as_view(), name='view_scene'),
    re_path(r'^ajax/action/time_slip/(?P<slug>\w+)/$', action_timeslip, name='action_time_slip'),
    re_path(r'^ajax/scene/(?P<id>\d+)/update/(?P<field>\w+)/$', update_scene, name='update_scene'),
    # re_path(r'^munich/$', show_munich, name='show_munich'),
    re_path(r'^ajax/display/map/(?P<slug>\w+)/$', display_map, name='display_map'),
    re_path(r'^ajax/display/chronicle_book/$', chronicle_book, name='chronicle_book'),
]
