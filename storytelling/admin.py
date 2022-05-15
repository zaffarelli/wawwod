from django.contrib import admin
from storytelling.models.stories import Story, StoryAdmin
from storytelling.models.scenes import Scene, SceneAdmin
from storytelling.models.places import Place, PlaceAdmin
from storytelling.models.cities import City, CityAdmin
from storytelling.models.districts import District, DistrictAdmin


admin.site.register(Story, StoryAdmin)
admin.site.register(Place, PlaceAdmin)
admin.site.register(Scene, SceneAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(District, DistrictAdmin)

