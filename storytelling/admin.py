from django.contrib import admin
from storytelling.models.stories import Story, StoryAdmin
from storytelling.models.scenes import Scene, SceneAdmin
from storytelling.models.places import Place, PlaceAdmin


admin.site.register(Story, StoryAdmin)
admin.site.register(Place, PlaceAdmin)
admin.site.register(Scene, SceneAdmin)

