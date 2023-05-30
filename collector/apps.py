from django.apps import AppConfig


class CollectorConfig(AppConfig):
    name = 'collector'

    def ready(self):
        # When migrating
        # pass
        import collector.signals.creatures