from django.db.models.signals import pre_save
from django.dispatch import receiver
from collector.models.creatures import Creature
from collector.models.disciplines import Discipline
from datetime import datetime
from collector.utils.wod_reference import get_current_chronicle


@receiver(pre_save, sender=Creature, dispatch_uid='update_creature')
def update_creature(sender, instance, **kwargs):
    if instance.name == '':
        chronicle = get_current_chronicle()
        instance.name = f'new  {datetime.timestamp(datetime.now())}'
        instance.chronicle == chronicle.acronym
    instance.update_rid()
    instance.need_fix = True
    instance.fix()


@receiver(pre_save, sender=Discipline, dispatch_uid='update_discipline')
def update_creature(sender, instance, **kwargs):
    instance.fix()
