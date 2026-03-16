from django.db.models.signals import pre_save
from django.dispatch import receiver
from collector.models.deeds import Deed


@receiver(pre_save, sender=Deed, dispatch_uid='update_deed')
def update_deed(sender, instance, **kwargs):
    instance.fix()
