from django.contrib import admin

from collector.models.gifts import Gift, GiftAdmin
from collector.models.rites import Rite, RiteAdmin
from collector.models.creatures import Creature, CreatureAdmin
from collector.models.chronicles import Chronicle, ChronicleAdmin

from collector.models.legacy import CollectorNybnKindreds, CollectorNybnKindredsAdmin

admin.site.register(Creature, CreatureAdmin)
admin.site.register(Chronicle, ChronicleAdmin)
admin.site.register(Gift, GiftAdmin)
admin.site.register(Rite, RiteAdmin)

admin.site.register(CollectorNybnKindreds, CollectorNybnKindredsAdmin)