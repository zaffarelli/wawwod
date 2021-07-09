from django.apps import AppConfig


class StorytellingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'storytelling'

    def ready(self):
        #import storytelling.signals.creatures
        pass