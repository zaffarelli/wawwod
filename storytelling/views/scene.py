from django.views.generic.edit import UpdateView
from django.views.generic.detail import DetailView
from django.contrib import messages
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.template.loader import get_template
from django.shortcuts import redirect, reverse
from storytelling.models.scenes import Scene
from storytelling.forms.scene import SceneForm
from storytelling.mixins.ajaxfromresponse import AjaxFromResponseMixin


class SceneDetailView(DetailView):
    model = Scene
    context_object_name = 'c'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # context['no_skill_edit'] = True
        # blokes = Bloke.objects.filter(character__full_name=context['c'].full_name)
        # context['blokes'] = BlokesFormSet(instance=self.object)
        # messages.success(self.request, 'Display character %s' % (context['c'].full_name))
        return context


class SceneUpdateView(AjaxFromResponseMixin, UpdateView):
    model = Scene
    form_class = SceneForm
    context_object_name = 'c'
    template_name_suffix = '_update_form'
    success_url = 'view_scene'

    # def form_valid(self, form):
    #     context = self.get_context_data(form=form)
    #     tourofdutys_formset = context['tourofdutys']
    #     if tourofdutys_formset.is_valid():
    #         response = super().form_valid(form)
    #         tourofdutys_formset.instance = self.object
    #         tourofdutys_formset.save()
    #         return response
    #     else:
    #         messages.error(self.request, 'Avatar %s has errors. unable to save.' % (context['c'].full_name))
    #         return super().form_invalid(form)

    # def get_context_data(self, **kwargs):
    #     context = super(SceneUpdateView, self).get_context_data(**kwargs)
    #     if self.request.POST:
    #         context['form'] = SceneForm(self.request.POST, instance=self.object)
    #         context['tourofdutys'] = TourOfDutyFormSet(self.request.POST, instance=self.object)
    #         context['tourofdutys'].full_clean()
    #         messages.success(self.request, 'Avatar updated: %s' % (context['form']['full_name'].value()))
    #     else:
    #         context['form'] = SceneForm(instance=self.object)
    #         context['tourofdutys'] = TourOfDutyFormSet(instance=self.object)
    #         messages.info(self.request, 'Avatar displayed: %s' % (context['form']['full_name'].value()))
    #     return context

