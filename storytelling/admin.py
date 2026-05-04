from django.contrib import admin
# from storytelling.models.scenes import Scene, SceneAdmin
# from storytelling.models.places import Place, PlaceAdmin
from storytelling.models.hotspots import HotSpot, HotSpotAdmin
from storytelling.models.cities import City, CityAdmin
from storytelling.models.districts import District, DistrictAdmin



# admin.site.register(Place, PlaceAdmin)
# admin.site.register(Scene, SceneAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(District, DistrictAdmin)
admin.site.register(HotSpot, HotSpotAdmin)
