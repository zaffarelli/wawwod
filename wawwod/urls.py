from django.contrib import admin
from django.conf.urls import include
from django.urls import re_path

admin.site.site_header = "WaWWoD (Administration)"
admin.site.site_title = "WaWWoD"
admin.site.index_title = "Welcome to the WaWWoD collector."

urlpatterns = [
    re_path("^admin/", admin.site.urls),
    re_path("^accounts/", include("django.contrib.auth.urls")),
    re_path("", include("collector.urls")),
    re_path("", include("storytelling.urls")),

]
