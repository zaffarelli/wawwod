from django.db.models.signals import pre_save
from django.dispatch import receiver
from collector.models.septs import Sept


@receiver(pre_save, sender=Sept, dispatch_uid='update_sept')
def update_sept(sender, instance, **kwargs):
    instance.fix()



