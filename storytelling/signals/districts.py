from django.db.models.signals import pre_save
from django.dispatch import receiver
from storytelling.models.districts import District
from storytelling.models.hotspots import HotSpot


@receiver(pre_save, sender=District, dispatch_uid='update_district')
def update_district(sender, instance, **kwargs):
   instance.fix()


@receiver(pre_save, sender=HotSpot, dispatch_uid='update_hotspot')
def update_hotspot(sender, instance, **kwargs):
   instance.fix()
