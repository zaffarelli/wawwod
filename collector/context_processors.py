def commons(request):
    from collector.models.adventures import Adventure
    adventure, chronicle, season = None, None, None
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
    else:
        context = {
            "chronicle": "",
            "chronicle_name": "",
            "chronicle_logo": "collector/",
            "season": "",
            "adventure": "",
        }
    context["user"] = request.user
    return context