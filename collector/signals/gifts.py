from django.db.models.signals import pre_save
from django.dispatch import receiver
from collector.models.gifts import Gift

@receiver(pre_save, sender=Gift, dispatch_uid='update_gift')
def update_gift(sender, instance, **kwargs):
    instance.fix()



