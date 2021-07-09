from django.test import TestCase
from collector.tests.factories import BlankCreatureFactory, KindredFactory, GarouFactory
from collector.utils.wod_reference import get_current_chronicle


class CreatureTest(TestCase):
    fixtures = ['chronicles.xml', 'creatures.xml']

    def test_creature_default_chronicle(self):
        chronicle = get_current_chronicle()
        c = BlankCreatureFactory.build()
        self.assertEquals(c.chronicle, chronicle.acronym)

    def test_kindred_no_fix_without_tag(self):
        c = KindredFactory.build()
        c.need_fix = False
        c.save()
        self.assertEquals(c.total_physical, 0)

    def test_garou_fix_with_tag(self):
        c = GarouFactory.build()
        c.need_fix = True
        c.save()
        self.assertEquals(c.total_physical, 3)