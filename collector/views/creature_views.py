from django.views.generic.edit import UpdateView
from django.views.generic.detail import DetailView
from collector.forms.creature_form import CreatureForm
from collector.models.creatures import Creature


class CreatureDetailView(DetailView):
    model = Creature
    context_object_name = 'c'
    slug_field = 'rid'
    slug_url_kwarg = 'slug'
    query_pk_and_slug = True
