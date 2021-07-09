from django.forms import ModelForm, inlineformset_factory
from storytelling.models.scenes import Scene, ScenesLink, SceneFromInline, SceneToInline


class SceneForm(ModelForm):
    class Meta:
        model = Scene
        fields = '__all__'
    inlines = [
        SceneFromInline,
        SceneToInline
        ]


SceneFromLinkFormSet = inlineformset_factory(Scene, ScenesLink, fk_name='scene_from', fields='__all__', extra=10, can_delete=True)
SceneToLinkFormSet = inlineformset_factory(Scene, ScenesLink, fk_name='scene_to', fields='__all__', extra=10, can_delete=True)