# exec(open('scripts/hamburg_funky_stats.py').read())
from collector.models.creatures import Creature

hamburgers = Creature.objects.filter(chronicle="HbN", hidden=False,creature__in=["kindred","ghoul"]).order_by("-creature","-freebies")
lines = []
entry = []
entry.append(f"Name")
entry.append(f"Freebies")
entry.append(f"True Age")
entry.append(f"Sire")
entry.append(f"Willpower")
entry.append(f"Generation")
entry.append(f"Status")
entry.append(f"Position")
entry.append(f"Clan")
entry.append(f"Nature")
entry.append(f"Demeanor")
entry.append(f"Type")
entry.append(f"Group")
entry.append(f"Subgroup")
entry.append(f"Condition")
lines.append(", ".join(entry))
for h in hamburgers:
    entry = []
    entry.append(f"{h.name}")
    entry.append(f"{h.freebies}")
    entry.append(f"{h.trueage}")
    entry.append(f"{h.sire}")
    entry.append(f"{h.willpower}")
    if h.creature == "kindred":
        entry.append(f"{13-h.background3}")
    else:
        entry.append(f"")
    entry.append(f"{h.background9}")
    entry.append(f"{h.position}")
    entry.append(f"{h.family}")
    entry.append(f"{h.nature}")
    entry.append(f"{h.demeanor}")
    entry.append(f"{h.creature}")
    entry.append(f"{h.group}")
    entry.append(f"{h.groupspec}")
    entry.append(f"{h.status}")
    lines.append(", ".join(entry))

print("\n".join(lines))