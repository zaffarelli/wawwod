from collector.utils import wod_reference
from django.conf import settings


def commons(request):
    from collector.models.chronicles import Chronicle
    from collector.models.adventures import Adventure
    from collector.models.seasons import Season
    # Adventure.set_current("REB")
    adventure = Adventure.current()
    chronicle = Chronicle.current()
    season = Season.current()
    print("** Context Processor:", chronicle.name, season.name, adventure.name)
    context = {'chronicle': chronicle.acronym, 'chronicle_name': chronicle.name,
               'chronicle_logo': "collector/" + chronicle.image_logo, "season": season.acronym, "adventure": adventure.acronym}
    # context = {'chronicle': '', 'chronicle_name': '',
    #            'chronicle_logo': "collector/" , "season": '',
    #            "adventure": ""}

    return context
