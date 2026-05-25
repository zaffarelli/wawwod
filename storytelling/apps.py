from django.apps import AppConfig
import sys

class StorytellingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "storytelling"

    def ready(self):
        #pass
        import storytelling.signals.districts
        import storytelling.signals.cities
        import storytelling.signals.hotspots

