from collector.utils import wod_reference
from django.conf import settings


def commons(request):
    from collector.models.chronicles import Chronicle
    chronicle = wod_reference.get_current_chronicle()
    season = chronicle.season
    adventure = chronicle.adventure
    if season:
        s = season.acronym
        if adventure:
            a = adventure.acronym
        else:
            a = ""
    else:
        s = ""
    print("CP:",s,a)
    context = {'chronicle': chronicle.acronym, 'chronicle_name': chronicle.name,
               'chronicle_logo': "collector/" + chronicle.image_logo, "season": s, "adventure": a}
    return context
