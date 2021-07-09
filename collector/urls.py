from django.urls import path, re_path
from collector.views.base import index, get_list, updown, userinput, add_creature, change_chronicle, \
    display_gaia_wheel, display_lineage, display_crossover_sheet, add_kindred
from collector.views.actions import change_settings, refix_all, extract_mechanics, extract_per_group, extract_raw, \
    extract_roster
from collector.views.creature_views import CreatureDetailView

urlpatterns = [
    re_path(r'^$', index, name='index'),
    re_path(r'^ajax/list/creatures/(?P<pid>\d+)/(?P<slug>\w+)/$', get_list, name='get_list'),
    re_path(r'^ajax/switch/chronicle/(?P<slug>\w+)/$', change_chronicle, name='change_chronicle'),
    re_path(r'^ajax/display/gaia_wheel/$', display_gaia_wheel, name='display_gaia_wheel'),
    re_path(r'^ajax/display/kindred_lineage/(?P<slug>\w+)/$', display_lineage, name='display_lineage'),
    re_path(r'^ajax/display/kindred_lineage/$', display_lineage, name='display_lineage'),
    re_path(r'^ajax/display/crossover_sheet/$', display_crossover_sheet, name='display_crossover_sheet'),
    re_path(r'^ajax/display/crossover_sheet/(?P<slug>\w+)/$', display_crossover_sheet, name='display_crossover_sheet'),
    re_path(r'^ajax/view/creature/(?P<slug>\w+)/$', CreatureDetailView.as_view(), name='view_creature'),
    re_path(r'^ajax/editable/updown/$', updown, name='updown'),
    re_path(r'^ajax/editable/userinput/$', userinput, name='userinput'),
    re_path(r'^ajax/collector_action/add_creature/(?P<slug>\w+)/$', add_creature, name='add_creature'),
    re_path(r'^ajax/collector_action/add_kindred/(?P<slug>\w+)/$', add_kindred, name='add_kindred'),
    re_path(r'^ajax/action/settings/$', change_settings, name='change_settings'),
    re_path(r'^ajax/collector_action/refix_all/$', refix_all, name='refix_all'),
    re_path(r'^api/text/(?P<slug>\w+)/$', extract_raw, name='extract_raw'),
    re_path(r'^api/roster/(?P<slug>\w+)/$', extract_roster, name='extract_roster'),
    re_path(r'^api/mechanics/$', extract_mechanics, name='extract_mechanics'),
    re_path(r'^api/group/(?P<slug>\w+)/$', extract_per_group, name='extract_per_group'),
]
