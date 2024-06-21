#!/usr/bin/env python
# exec(open('scripts/gifts_yaml_loader.py').read())
# python ./manage.py shell < scripts/gifts_yaml_loader.py
from collector.models.gifts import Gift


class GiftLoader:
    def __init__(self, filename):
        print("WaWWoD Gifts Loader")
        self.filename = filename

    def load_gifts(self):
        Gift.load_from_yaml(self.filename)

    def perform(self):
        self.load_gifts()


gl = GiftLoader('./collector/static/js/gifts.yml')
gl.perform()
