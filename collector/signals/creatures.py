from django.db.models.signals import pre_save
from django.dispatch import receiver
from collector.models.creatures import Creature
from datetime import datetime
from collector.utils.wod_reference import get_current_chronicle


@receiver(pre_save, sender=Creature, dispatch_uid='update_creature')
def update_creature(sender, instance, **kwargs):
    if instance.name == '':
        chronicle = get_current_chronicle()
        instance.name = f'new  {datetime.timestamp(datetime.now())}'
        instance.chronicle == chronicle.acronym
    instance.update_rid()
    if instance.need_fix:
        instance.fix()

