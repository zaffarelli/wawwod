from collector.models.creatures import Creature
all = Creature.objects.all()
for x in all:
    x.need_fix = True
    x.save()
