from collector.utils import wod_reference
from django.conf import settings
import logging

# logger = logging.getLogger('wawwod')


def commons(request):
    from collector.models.adventures import Adventure
    adventure, chronicle, season = Adventure.current_full()
    if adventure:
        repair_mode = False
    else:
        repair_mode = True
    if not repair_mode:
        context = {
            "chronicle": chronicle.acronym,
            "chronicle_name": chronicle.name,
            "chronicle_logo": f"collector/svg/{chronicle.image_logo}",
            "season": season.acronym,
            "adventure": adventure.code,
            "adventure_name": adventure.name,
        }
        # logger.warning(f"{context}")
    else:
        # logger.warning("** Context Processor: Adventure not found!")
        context = {
            "chronicle": "",
            "chronicle_name": "",
            "chronicle_logo": "collector/",
            "season": "",
            "adventure": "",
        }
    context["user"] = request.user
    return context
