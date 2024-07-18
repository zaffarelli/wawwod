from django.contrib import admin

from collector.models.gifts import Gift, GiftAdmin
from collector.models.disciplines import Discipline, DisciplineAdmin
from collector.models.rites import Rite, RiteAdmin
from collector.models.creatures import Creature, CreatureAdmin
from collector.models.chronicles import Chronicle, ChronicleAdmin
from collector.models.adventures import Adventure, AdventureAdmin
from collector.models.seasons import Season, SeasonAdmin
from collector.models.archetypes import Archetype, ArchetypeAdmin
from collector.models.backgrounds import Background, BackgroundAdmin
from collector.models.septs import Sept, SeptAdmin

from collector.models.legacy import CollectorNybnKindreds, CollectorNybnKindredsAdmin

admin.site.register(Creature, CreatureAdmin)
admin.site.register(Chronicle, ChronicleAdmin)
admin.site.register(Season, SeasonAdmin)
admin.site.register(Adventure, AdventureAdmin)
admin.site.register(Gift, GiftAdmin)
admin.site.register(Discipline, DisciplineAdmin)
admin.site.register(Rite, RiteAdmin)
admin.site.register(Archetype, ArchetypeAdmin)
admin.site.register(Background, BackgroundAdmin)
admin.site.register(Sept, SeptAdmin)

admin.site.register(CollectorNybnKindreds, CollectorNybnKindredsAdmin)