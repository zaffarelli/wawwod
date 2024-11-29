from django.db.models.signals import pre_save
from django.dispatch import receiver
from collector.models.totems import Totem


@receiver(pre_save, sender=Totem, dispatch_uid='update_totem')
def update_totem(sender, instance, **kwargs):
    instance.fix()
