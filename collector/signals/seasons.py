from django.db.models.signals import pre_save
from django.dispatch import receiver
from collector.models.seasons import Season


@receiver(pre_save, sender=Season, dispatch_uid='update_season')
def update_season(sender, instance, **kwargs):
    instance.fix()



