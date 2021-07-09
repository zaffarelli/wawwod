from collector.models.creatures import Creature
from collector.utils.wod_reference import get_current_chronicle
import factory


class BlankCreatureFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Creature
    chronicle = get_current_chronicle().acronym


class KindredFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Creature
    name = 'Vlad the Vampire'
    creature = 'kindred'
    attribute0 = 2
    attribute1 = 2
    attribute2 = 2
    attribute3 = 3
    attribute4 = 2
    attribute5 = 3
    attribute6 = 4
    attribute7 = 4
    attribute8 = 2
    sex = False


class GarouFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Creature
    name = 'Tessa le Garou'
    creature = 'garou'
    attribute0 = 2
    attribute1 = 2
    attribute2 = 2
    attribute3 = 3
    attribute4 = 2
    attribute5 = 3
    attribute6 = 4
    attribute7 = 4
    attribute8 = 2
    sex = True


