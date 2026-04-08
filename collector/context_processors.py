from collector.utils import wod_reference
from django.conf import settings


def commons(request):
    from collector.models.chronicles import Chronicle
    from collector.models.adventures import Adventure
    from collector.models.seasons import Season

    # Adventure.set_current("REB")
    adventure, chronicle, season = Adventure.current_full()
    if adventure:
        repair_mode = False
    else:
        repair_mode = True
    if not repair_mode:
        print("** Context Processor:", chronicle.name, season.name, adventure.name)
        context = {
            "chronicle": chronicle.acronym,
            "chronicle_name": chronicle.name,
            "chronicle_logo": f"collector/svg/{chronicle.image_logo}",
            "season": season.acronym,
            "adventure": adventure.code,
            "adventure_name": adventure.name,
        }
    else:
        print("** Context Processor: Adventure not found!")
        context = {
            "chronicle": "",
            "chronicle_name": "",
            "chronicle_logo": "collector/",
            "season": "",
            "adventure": "",
        }

    return context
