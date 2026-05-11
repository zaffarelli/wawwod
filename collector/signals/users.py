from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from collector.models.profiles import Profile


@receiver(post_save, sender=User, dispatch_uid="auto_create_profile")
def auto_create_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile(user=instance)
        profile.save()
