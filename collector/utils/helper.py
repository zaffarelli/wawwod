from django.contrib import admin
from colour import Color
import os

def json_default(value):
    import datetime

    if isinstance(value, datetime.datetime):
        return dict(
            year=value.year,
            month=value.month,
            day=value.day,
            hour=value.hour,
            minute=value.minute,
        )
    elif isinstance(value, datetime.date):
        return dict(year=value.year, month=value.month, day=value.day)
    else:
        return value.__dict__


def toRID(txt):
    if txt == "":
        return ""
    s = txt.lower()
    x = (
        s.replace(" ", "_")
        .replace("'", "")
        .replace("é", "e")
        .replace("è", "e")
        .replace("ë", "e")
        .replace("â", "a")
        .replace("ô", "o")
        .replace('"', "")
        .replace("ï", "i")
        .replace("à", "a")
        .replace("-", "")
        .replace("ö", "oe")
        .replace("ä", "ae")
        .replace("ü", "ue")
        .replace("ß", "ss")
        .replace("ç", "c")
    )
    return f"_{x.lower()}"


# # Converting lat/long to cartesian
# def get_cartesian(lat=None, lon=None):
#     import numpy as np
#     lat, lon = np.deg2rad(lat), np.deg2rad(lon)
#     R = 6371  # radius of the earth
#     x = R * np.cos(lat) * np.cos(lon)
#     y = R * np.cos(lat) * np.sin(lon)
#     z = R * np.sin(lat)
#     return x, y, z


def is_ajax(request):
    return request.headers.get("x-requested-with") == "XMLHttpRequest"


def refix(modeladmin, request, queryset):
    for item in queryset:
        item.fix()
        item.save()
    short_description = "Refix"


def roll(faces=10):
    def die():
        import math, os

        return math.floor((int.from_bytes(os.urandom(1)) / 256) * faces) + 1

    d = die()
    return d

class Colorizer:
    def __init__(self):
        self.palette = []
        self.current = 0
        self.randomize(color_count=8)

    def randomize(self, color_count=4):
        a = Color("cyan")
        b = Color("red")
        self.palette = list(a.range_to(b, color_count))
        palette = []
        for p in self.palette:
            p.saturation = 0.3
            p.luminance = 0.3
            palette.append(p)
        self.palette = palette
        self.current = 0

    def get_palette(self):
        d = []
        for c in self.palette:
            d.append(c.hex+"7f")
        return d

    def pop(self):
        self.current = (self.current + 1) % len(self.palette)
        return self.palette[self.current]

    @classmethod
    def random_color(cls):
        red = int.from_bytes(os.urandom(1))
        green = int.from_bytes(os.urandom(1))
        blue = int.from_bytes(os.urandom(1))
        c = f'#{red:02x}{green:02x}{blue:02x}'
        return c
