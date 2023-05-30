
from django.db.models.signals import pre_save
from django.dispatch import receiver
from storytelling.models.districts import District
from collector.utils.wod_reference import get_current_chronicle


@receiver(pre_save, sender=District, dispatch_uid='update_district')
def update_district(sender, instance, **kwargs):
    instance.fix()


