from django.db.models.signals import pre_save
from django.dispatch import receiver
from storytelling.models.cities import City


@receiver(pre_save, sender=City, dispatch_uid='update_cities')
def update_cities(sender, instance, **kwargs):
   instance.fix()


