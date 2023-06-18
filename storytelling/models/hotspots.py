from django.db import models
from django.contrib import admin
from storytelling.models.stories import Story
from collector.utils.helper import json_default
import json
import logging
from storytelling.models.cities import City

logger = logging.Logger(__name__)

DEFAULT_GPS = "0,0"

POI_TYPES = (
    ('n/a', 'None'),
    ('ely', 'Camarilla Elysium'),
    ('hvn', 'Camarilla Haven'),
    ('ind', 'Indepentents PoI'),
    ('hou', 'House of'),
    ('poi', 'Point Of Interest'),
    ('uba', 'U-bahn'),
)

POI_COLORS = {
    'n/a': '#C0C0C0',
    'ely': '#bed94c',
    'hvn': '#7cd94c',
    'ind': '#4cd96a',
    'hou': '#d9b24c',
    'poi': '#d94c4c',
    'uba': '#1535EF'
}

class HotSpot(models.Model):
    name = models.CharField(max_length=256, default='')
    type = models.CharField(max_length=3, default='n/a', choices=POI_TYPES, blank=True)
    color = models.CharField(max_length=9, default='#802020')
    is_public = models.BooleanField(default=True, blank=True)
    description = models.TextField(max_length=1024, blank=True, default='')
    gps_coords = models.CharField(default=DEFAULT_GPS, max_length=256, blank=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True)
    longitude = models.FloatField(default=0.0, blank=True)
    latitude = models.FloatField(default=0.0, blank=True)
    hyperlink = models.CharField(default="", max_length=1024, blank=True)

    def fix(self):
        if self.gps_coords != DEFAULT_GPS:
            words = self.gps_coords.split(',')
            if len(words) == 2:
                self.longitude = float(words[0])
                self.latitude = float(words[1])
        self.color = POI_COLORS[self.type]
        self.hyperlink = f'https://www.google.com/maps/search/?api=1&query={self.longitude}%2C{self.latitude}'

    def __str__(self):
        return f'{self.name}'

    def toJSON(self):
        jstr = json.dumps(self, default=json_default, sort_keys=True, indent=4)
        return jstr


class HotSpotAdmin(admin.ModelAdmin):
    list_display = ['name', 'longitude', 'latitude', "hyperlink", 'color', 'type', 'is_public']
    ordering = ['-type','name']
    search_fields = ['name', 'description', 'type']
    list_editable = ['color', 'type', 'is_public']
