from itertools import chain
import json

class Quaestor:
    def __init__(self):
        self.request = ""
        self.separator = "_xsepx_"

    def interpret(self):
        result = ""
        rationale = "What?"
        # Expected : self.text = "fetch:gift:_adel_the_swift"
        status, rationale, data = self.do_command()
        if status:
            result = data
        return status,rationale,result

    def do_command(self):
        data = []
        status = False
        rationale = ""
        print(self.request)
        if len(self.request) > 0:
            w = self.request.split(self.separator)
            print(w)
            if 3 == len(w):
                if "fetch" == w[0].lower():
                    rationale += "Go fetch "
                    if "gifts" == w[1].lower():
                        rationale += "all possible gifts for "
                        if w[2].startswith("_"):
                            from collector.models.creatures import Creature
                            rid = w[2]
                            creatures = Creature.objects.filter(rid=rid)
                            if len(creatures) == 1:
                                creature = creatures.first()
                                rationale += f"{creature.name}"
                                status = True
                                data = self.gift_for(creature)
                            elif len(creatures) == 0:
                                rationale += "a missing creature"
                            else:
                                rationale += "too many creatures!!!"
                else:
                    rationale = "I don't undetstand the request"
        return status, rationale, data

    def gift_for(self, creature):
        from collector.models.gifts import Gift
        from collector.templatetags.wod_filters import as_tribe_plural
        from collector.utils.wod_reference import ALL_TRIBES
        fb = {f"breed_{creature.breed}":True,"level__lte":creature.garou_rank}
        datab = Gift.objects.filter(**fb).values("name","level","references")
        fa = {f"auspice_{creature.auspice}": True,"level__lte":creature.garou_rank}
        dataa = Gift.objects.filter(**fa).values("name","level","references")
        tribe = as_tribe_plural(creature.family)
        # print(tribe)
        ft = {f"tribe_{ALL_TRIBES.index(tribe)}": True, "level__lte": creature.garou_rank}
        datat = Gift.objects.filter(**ft).values("name", "level", "references")
        data = chain(datab,dataa,datat)

        sorted_data = sorted(data, key=lambda k : k['level'])
        print(sorted_data)
        return sorted_data

    def perform(self, text=None):
        self.request = text
        x = self.interpret()
        return x
