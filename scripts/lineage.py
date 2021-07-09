from collector.models.creatures import Creature
import json
x = Creature.objects.filter(creature='kindred',name="Caine").first()
data = x.find_lineage()
with open('/home/zaffarelli/Projects/wawwod/collector/static/js/kindred.json', 'w') as fp:
  json.dump(data, fp)
print("Done")
