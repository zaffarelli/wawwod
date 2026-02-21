from django.db.models.signals import pre_save
from django.dispatch import receiver
from storytelling.models.hotspots import HotSpot


@receiver(pre_save, sender=HotSpot, dispatch_uid='update_hotspots')
def update_cities(sender, instance, **kwargs):
   instance.fix()


