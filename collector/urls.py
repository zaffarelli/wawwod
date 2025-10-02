from django.urls import path, re_path
from collector.views.base import index, get_list, updown, userinputastext, userinput, add_garou, change_chronicle, \
    display_gaia_wheel, display_dashboard, display_lineage, display_crossover_sheet, add_kindred, svg_to_pdf, \
    save_to_svg, display_sept, moon_phase, calendar, weaver_code, display_sept_rosters, quaestor, adventure_sheet, display_chronicle_map, add_kinfolk, add_mortal, bulk_add
from collector.views.actions import change_settings, refix_all, extract_mechanics, extract_per_group, extract_raw, \
    extract_roster, randomize, balance, refix_all
from collector.views.creature_views import CreatureDetailView

urlpatterns = [
    re_path(r'^$', index, name='index'),
    re_path(r'^ajax/list/creatures/(?P<pid>\d+)/(?P<slug>\w+)/$', get_list, name='get_list'),
    re_path(r'^ajax/switch/chronicle/(?P<slug>\w+)/$', change_chronicle, name='change_chronicle'),
    re_path(r'^ajax/display/gaia_wheel/$', display_gaia_wheel, name='display_gaia_wheel'),
    re_path(r'^ajax/display/dashboard/$', display_dashboard, name='display_dashboard'),
    re_path(r'^ajax/display/chronicle_map/$', display_chronicle_map, name='display_chronicle_map'),
    re_path(r'^ajax/display/adventure_sheet/$', adventure_sheet, name='adventure_sheet'),
    re_path(r'^ajax/display/kindred_lineage/(?P<slug>\w+)/$', display_lineage, name='display_lineage'),
    re_path(r'^ajax/display/kindred_lineage/$', display_lineage, name='display_lineage'),
    re_path(r'^ajax/display/septs/(?P<slug>\w+)/$', display_sept, name='display_sept'),
    re_path(r'^sept/(?P<slug>\w+)/text/$', display_sept_rosters, name='display_sept_rosters'),
    re_path(r'^ajax/display/crossover_sheet/$', display_crossover_sheet, name='display_crossover_sheet'),
    re_path(r'^ajax/display/crossover_sheet/(?P<slug>\w+)/$', display_crossover_sheet, name='display_crossover_sheet'),
    re_path(r'^ajax/display/crossover_sheet/(?P<slug>\w+)/(?P<option>\w+)/$', display_crossover_sheet, name='display_crossover_sheet'),
    re_path(r'^ajax/view/creature/(?P<slug>\w+)/$', CreatureDetailView.as_view(), name='view_creature'),
    re_path(r'^ajax/editable/updown/$', updown, name='updown'),
    re_path(r'^ajax/bulk/$', bulk_add, name='bulk_add'),
    re_path(r'^ajax/editable/userinput/$', userinput, name='userinput'),
    re_path(r'^ajax/editable/userinput/as_text/$', userinputastext, name='userinputastext'),
    re_path(r'^ajax/collector_action/add_garou/(?P<slug>\w+)/$', add_garou, name='add_garou'),
    re_path(r'^ajax/collector_action/add_kinfolk/(?P<slug>\w+)/$', add_kinfolk, name='add_kinfolk'),
    re_path(r'^ajax/collector_action/add_kindred/(?P<slug>\w+)/$', add_kindred, name='add_kindred'),
    re_path(r'^ajax/collector_action/add_mortal/(?P<slug>\w+)/$', add_mortal, name='add_mortal'),
    re_path(r'^ajax/collector_action/refix_all/$', refix_all, name='refix_all'),
    re_path(r'^ajax/action/settings/$', change_settings, name='change_settings'),
    # re_path(r'^ajax/collector_action/refix_all/$', refix_all, name='refix_all'),
    re_path(r'^api/text/(?P<slug>\w+)/$', extract_raw, name='extract_raw'),
    re_path(r'^api/roster/(?P<slug>\w+)/$', extract_roster, name='extract_roster'),
    re_path(r'^api/mechanics/$', extract_mechanics, name='extract_mechanics'),
    re_path(r'^api/group/(?P<slug>\w+)/$', extract_per_group, name='extract_per_group'),
    re_path(r'^ajax/character/svg2pdf/(?P<slug>[\w-]+)/$', svg_to_pdf, name='svg_to_pdf'),
    re_path(r'^ajax/character/save2svg/(?P<slug>[\w-]+)/$', save_to_svg, name='save_to_svg'),
    re_path(r'^api/balance/(?P<slug>\w+)/$', balance, name='balance'),
    re_path(r'^api/randomize/(?P<slug>\w+)/$', randomize, name='randomize'),
    re_path(r'^api/moon_phase/$', moon_phase, name='moon_phase'),
    re_path(r'^calendar/(?P<year>\w+)/$', calendar, name='calendar'),
    re_path(r'^weaver_code/(?P<code>\w+)/$', weaver_code, name='weaver_code'),
    re_path(r'^ajax/action/quaestor/(?P<slug>\w+)/$', quaestor, name='quaestor')
]

