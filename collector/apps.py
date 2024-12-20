from django.apps import AppConfig


class CollectorConfig(AppConfig):
    name = 'collector'

    def ready(self):
        import collector.signals.creatures
        import collector.signals.adventures
        import collector.signals.seasons
        import collector.signals.septs
        import collector.signals.gifts
        import collector.signals.totems
