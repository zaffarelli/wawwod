# exec(open('scripts/reghoul.py').read())
from collector.models.creatures import Creature
all_ghouls = Creature.objects.filter(chronicle="GHH", creature="ghoul", status__in=['UNBALANCED','OK+'])
for g in all_ghouls:
    print(g.name)
    g.randomize_all()
    g.need_fix = True
    g.save();
    g.balance_ghoul()