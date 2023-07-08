from django.db.models.signals import pre_save
from django.dispatch import receiver
from collector.models.adventures import Adventure


@receiver(pre_save, sender=Adventure, dispatch_uid='update_adventure')
def update_adventure(sender, instance, **kwargs):
    instance.fix()



