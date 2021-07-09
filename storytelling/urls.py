from django.urls import  re_path
from storytelling.views.base import display_storytelling, action_timeslip
from storytelling.views.scene import SceneDetailView, SceneUpdateView



urlpatterns = [
    re_path(r'^ajax/display/storytelling/$', display_storytelling, name='display_storytelling'),
    re_path(r'^ajax/edit/scene/(?P<pk>\d+)/$', SceneUpdateView.as_view(), name='edit_scene'),
    re_path(r'^ajax/view/scene/(?P<pk>\d+)/$', SceneDetailView.as_view(), name='view_scene'),
    re_path(r'^ajax/action/time_slip/(?P<slug>\w+)/$', action_timeslip, name='action_time_slip'),
]
