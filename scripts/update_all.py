from collector.models.creatures import Creature
all = Creature.objects.all()
for x in all:
    x.save()
