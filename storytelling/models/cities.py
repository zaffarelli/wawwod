from django.db import models
from django.contrib import admin
from collector.utils.helper import json_default
import requests
import json
import logging

logger = logging.Logger(__name__)


class City(models.Model):
    class Meta:
        verbose_name_plural = 'Cities'

    name = models.CharField(max_length=128, default='')
    chronicle = models.CharField(max_length=50, default='WOD')
    code = models.CharField(max_length=50, default='')
    description = models.TextField(max_length=1024, default='', blank=True)
    geojson_file = models.CharField(max_length=128, default='', blank=True)
    sector_property = models.CharField(max_length=128, default='sector', blank=True)
    name_property = models.CharField(max_length=128, default='name', blank=True)
    code_property = models.CharField(max_length=128, default='code', blank=True)
    font_scale = models.FloatField(default=1.0, blank=True)
    longitude = models.FloatField(default=0.0, blank=True)
    latitude = models.FloatField(default=0.0, blank=True)
    utc = models.IntegerField(default=0, blank=True)

    def sunrise_url(self):
        # 44.977918783484476 & lng = -93.27224591598777
        if self.latitude == 0:
            self.latitude = 44.977918783484476
        if self.longitude == 0:
            self.longitude = -93.27224591598777
        url = f'https://api.sunrise-sunset.org/json?lat={self.latitude}&lng={self.longitude}&date=2024-06-01'
        answer = requests.get(url, [])
        json_data = answer.json()
        print(url)
        print(json_data)

    def fix(self):
        self.sunrise_url()
        # if self.code == "MN":
        #     self.grab_districts()

    def grab_districts(self):
        file = f"/home/zaffarelli/Projects/wawwod/storytelling/static/storytelling/geojson/{self.geojson_file}.geojson"
        with open(file, "r") as f:
            j = json.load(f)
        from storytelling.models.districts import District
        for item in j["features"]:
            name = item["properties"]["name"]
            id = item["properties"]["cartodb_id"]
            code = f"{self.code}{id:03}"
            print(f"{name:>20} ({id:03}) => {code}")
            districts = District.objects.filter(code=code)
            district = None
            if len(districts) == 0:
                district = District()
            else:
                district = districts.first()
            if district:
                district.d_num = id
                district.name = name
                district.city = self
                district.district_name = name
                district.sector_name = ""
                district.save()

    @classmethod
    def usa_extract_states(cls, numberStates=[]):
        """
        This function exctracts states from the geojson countis map
        :param numberStates: Array of json associations per State.
            Example: {"number":"27", "name":"Minnesota"},{"number":"27", "name":"North Dakota"}
        :returns True if everything went well
        """
        with open("/home/zaffarelli/Projects/wawwod/storytelling/static/storytelling/geojson/usa.geojson") as f:
            lines = f.readlines()
        new_lines = []
        final_file_name = []
        acro = ""
        for state in numberStates:
            final_file_name.append(state["name"].replace("_", ""))
            acro += state["name"][:2].upper()
            print(acro)
        the_name = "_".join(final_file_name)
        full_name = f'/home/zaffarelli/Projects/wawwod/storytelling/static/storytelling/geojson/{the_name.lower()}.geojson'
        for line in lines:
            if line.startswith('{ "type": "Feature",'):
                push = False
                for state in numberStates:
                    if f'"STATEFP": "{state["number"]}"' in line:
                        push = True
                        break
                if push:
                    new_lines.append(line)
            else:
                new_lines.append(line)
        with open(full_name, "w+") as f:
            f.writelines(new_lines)
        city = cls()
        city.name = the_name
        city.code = acro
        city.geojson_file = the_name.lower()
        city.sector_property = "STATEFP"
        city.name_property = "NAME"
        city.code_property = "GEOID"
        city.chronicle = "VMI RAMI"
        city.font_scale = 0.8
        city.save()

    @property
    def options_json(self):
        json_data = {}
        json_data["name"] = self.name
        json_data["code"] = self.code
        json_data["geojson_file"] = self.geojson_file
        json_data["sector_property"] = self.sector_property
        json_data["code_property"] = self.code_property
        json_data["name_property"] = self.name_property
        json_data["font_scale"] = self.font_scale
        return json_data

    @property
    def options(self):
        return json.dumps(self.options_json)

    def in_chronicle(self, acronym=""):
        result = False
        if len(acronym) > 0:
            if acronym in self.chronicle.split(" "):
                result = True
        return result

    def __str__(self):
        return f'{self.name}'

    def toJSON(self):
        jstr = json.dumps(self, default=json_default, sort_keys=True, indent=4)
        return jstr


class CityAdmin(admin.ModelAdmin):
    list_display = ['name', "chronicle", 'code', 'geojson_file', 'options', 'description']
    list_editable = ["chronicle", 'code', 'geojson_file']
    ordering = ['name']
    search_fields = ['name', 'code', 'description']
    from collector.utils.helper import refix
    actions = [refix]
