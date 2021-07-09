from django.db import models
from django.contrib import admin
import random


class CollectorNybnKindreds(models.Model):
    class Meta:
        managed = False
        db_table = 'collector_nybn_kindreds'

    player = models.CharField(db_column='Player', max_length=32, blank=True, null=True)  # Field name made lowercase.
    name = models.CharField(db_column='Name', primary_key=True, max_length=128)  # Field name made lowercase.
    clan = models.CharField(db_column='Clan', max_length=32, blank=True, null=True)  # Field name made lowercase.
    gen = models.IntegerField(db_column='Gen', blank=True, null=True)  # Field name made lowercase.
    nature = models.CharField(db_column='Nature', max_length=32, blank=True, null=True)  # Field name made lowercase.
    demeanor = models.CharField(db_column='Demeanor', max_length=32, blank=True, null=True)  # Field name made lowercase.
    disc_animalism = models.IntegerField(db_column='Animalism', blank=True, null=True)  # Field name made lowercase.
    disc_auspex = models.IntegerField(db_column='Auspex', blank=True, null=True)  # Field name made lowercase.
    disc_celerity = models.IntegerField(db_column='Celerity', blank=True, null=True)  # Field name made lowercase.
    disc_chimerstry = models.IntegerField(db_column='Chimerstry', blank=True, null=True)  # Field name made lowercase.
    disc_daimoinon = models.IntegerField(db_column='Daimoinon', blank=True, null=True)  # Field name made lowercase.
    disc_dementation = models.IntegerField(db_column='Dementation', blank=True, null=True)  # Field name made lowercase.
    disc_dominate = models.IntegerField(db_column='Dominate', blank=True, null=True)  # Field name made lowercase.
    disc_fortitude = models.IntegerField(db_column='Fortitude', blank=True, null=True)  # Field name made lowercase.
    disc_melpominee = models.IntegerField(db_column='Melpominee', blank=True, null=True)  # Field name made lowercase.
    disc_mytherceria = models.IntegerField(db_column='Mytherceria', blank=True, null=True)  # Field name made lowercase.
    disc_necromancy = models.IntegerField(db_column='Necromancy', blank=True, null=True)  # Field name made lowercase.
    disc_obeah = models.IntegerField(db_column='Obeah', blank=True, null=True)  # Field name made lowercase.
    disc_obfuscate = models.IntegerField(db_column='Obfuscate', blank=True, null=True)  # Field name made lowercase.
    disc_obtenebration = models.IntegerField(db_column='Obtenebration', blank=True, null=True)  # Field name made lowercase.
    disc_potence = models.IntegerField(db_column='Potence', blank=True, null=True)  # Field name made lowercase.
    disc_presence = models.IntegerField(db_column='Presence', blank=True, null=True)  # Field name made lowercase.
    disc_protean = models.IntegerField(db_column='Protean', blank=True, null=True)  # Field name made lowercase.
    disc_quietus = models.IntegerField(db_column='Quietus', blank=True, null=True)  # Field name made lowercase.
    disc_sanguinus = models.IntegerField(db_column='Sanguinus', blank=True, null=True)  # Field name made lowercase.
    disc_serpentis = models.IntegerField(db_column='Serpentis', blank=True, null=True)  # Field name made lowercase.
    disc_temporis = models.IntegerField(db_column='Temporis', blank=True, null=True)  # Field name made lowercase.
    disc_thanatosis = models.IntegerField(db_column='Thanatosis', blank=True, null=True)  # Field name made lowercase.
    disc_thaumaturgy = models.IntegerField(db_column='Thaumaturgy', blank=True, null=True)  # Field name made lowercase.
    disc_valeren = models.IntegerField(db_column='Valeren', blank=True, null=True)  # Field name made lowercase.
    disc_vicissitude = models.IntegerField(db_column='Vicissitude', blank=True, null=True)  # Field name made lowercase.
    disc_visceratika = models.IntegerField(db_column='Visceratika', blank=True, null=True)  # Field name made lowercase.
    coterie = models.CharField(db_column='Coterie', max_length=128, blank=True, null=True)  # Field name made lowercase.
    role = models.CharField(db_column='Role', max_length=128, blank=True, null=True)  # Field name made lowercase.
    strength = models.IntegerField(db_column='Strength', blank=True, null=True)  # Field name made lowercase.
    dexterity = models.IntegerField(db_column='Dexterity', blank=True, null=True)  # Field name made lowercase.
    stamina = models.IntegerField(db_column='Stamina', blank=True, null=True)  # Field name made lowercase.
    charisma = models.IntegerField(db_column='Charisma', blank=True, null=True)  # Field name made lowercase.
    manipulation = models.IntegerField(db_column='Manipulation', blank=True, null=True)  # Field name made lowercase.
    appearance = models.IntegerField(db_column='Appearance', blank=True, null=True)  # Field name made lowercase.
    perception = models.IntegerField(db_column='Perception', blank=True, null=True)  # Field name made lowercase.
    intelligence = models.IntegerField(db_column='Intelligence', blank=True, null=True)  # Field name made lowercase.
    wits = models.IntegerField(db_column='Wits', blank=True, null=True)  # Field name made lowercase.
    alertness = models.IntegerField(db_column='Alertness', blank=True, null=True)  # Field name made lowercase.
    athletics = models.IntegerField(db_column='Athletics', blank=True, null=True)  # Field name made lowercase.
    brawl = models.IntegerField(db_column='Brawl', blank=True, null=True)  # Field name made lowercase.
    dodge = models.IntegerField(db_column='Dodge', blank=True, null=True)  # Field name made lowercase.
    empathy = models.IntegerField(db_column='Empathy', blank=True, null=True)  # Field name made lowercase.
    expression = models.IntegerField(db_column='Expression', blank=True, null=True)  # Field name made lowercase.
    intimidation = models.IntegerField(db_column='Intimidation', blank=True, null=True)  # Field name made lowercase.
    leadership = models.IntegerField(db_column='Leadership', blank=True, null=True)  # Field name made lowercase.
    streetwise = models.IntegerField(db_column='Streetwise', blank=True, null=True)  # Field name made lowercase.
    subterfuge = models.IntegerField(db_column='Subterfuge', blank=True, null=True)  # Field name made lowercase.
    animalken = models.IntegerField(db_column='AnimalKen', blank=True, null=True)  # Field name made lowercase.
    crafts = models.IntegerField(db_column='Crafts', blank=True, null=True)  # Field name made lowercase.
    drive = models.IntegerField(db_column='Drive', blank=True, null=True)  # Field name made lowercase.
    etiquette = models.IntegerField(db_column='Etiquette', blank=True, null=True)  # Field name made lowercase.
    firearms = models.IntegerField(db_column='Firearms', blank=True, null=True)  # Field name made lowercase.
    melee = models.IntegerField(db_column='Melee', blank=True, null=True)  # Field name made lowercase.
    performance = models.IntegerField(db_column='Performance', blank=True, null=True)  # Field name made lowercase.
    security = models.IntegerField(db_column='Security', blank=True, null=True)  # Field name made lowercase.
    stealth = models.IntegerField(db_column='Stealth', blank=True, null=True)  # Field name made lowercase.
    survival = models.IntegerField(db_column='Survival', blank=True, null=True)  # Field name made lowercase.
    academics = models.IntegerField(db_column='Academics', blank=True, null=True)  # Field name made lowercase.
    computer = models.IntegerField(db_column='Computer', blank=True, null=True)  # Field name made lowercase.
    finance = models.IntegerField(db_column='Finance', blank=True, null=True)  # Field name made lowercase.
    investigation = models.IntegerField(db_column='Investigation', blank=True, null=True)  # Field name made lowercase.
    law = models.IntegerField(db_column='Law', blank=True, null=True)  # Field name made lowercase.
    linguistics = models.IntegerField(db_column='Linguistics', blank=True, null=True)  # Field name made lowercase.
    medicine = models.IntegerField(db_column='Medicine', blank=True, null=True)  # Field name made lowercase.
    occult = models.IntegerField(db_column='Occult', blank=True, null=True)  # Field name made lowercase.
    politics = models.IntegerField(db_column='Politics', blank=True, null=True)  # Field name made lowercase.
    science = models.IntegerField(db_column='Science', blank=True, null=True)  # Field name made lowercase.
    humanity = models.IntegerField(db_column='Humanity', blank=True, null=True)  # Field name made lowercase.
    willpower = models.IntegerField(db_column='Willpower', blank=True, null=True)  # Field name made lowercase.
    conscience = models.IntegerField(db_column='Conscience', blank=True, null=True)  # Field name made lowercase.
    selfcontrol = models.IntegerField(db_column='SelfControl', blank=True, null=True)  # Field name made lowercase.
    courage = models.IntegerField(db_column='Courage', blank=True, null=True)  # Field name made lowercase.
    bloodpool = models.IntegerField(db_column='BloodPool', blank=True, null=True)  # Field name made lowercase.
    path = models.CharField(db_column='Path', max_length=64, blank=True, null=True)  # Field name made lowercase.
    sect = models.CharField(db_column='Sect', max_length=64, blank=True, null=True)  # Field name made lowercase.
    allies = models.IntegerField(db_column='Allies', blank=True, null=True)  # Field name made lowercase.
    contact = models.IntegerField(db_column='Contact', blank=True, null=True)  # Field name made lowercase.
    fame = models.IntegerField(db_column='Fame', blank=True, null=True)  # Field name made lowercase.
    generation = models.IntegerField(db_column='Generation', blank=True, null=True)  # Field name made lowercase.
    herd = models.IntegerField(db_column='Herd', blank=True, null=True)  # Field name made lowercase.
    influence = models.IntegerField(db_column='Influence', blank=True, null=True)  # Field name made lowercase.
    mentor = models.IntegerField(db_column='Mentor', blank=True, null=True)  # Field name made lowercase.
    resources = models.IntegerField(db_column='Resources', blank=True, null=True)  # Field name made lowercase.
    retainers = models.IntegerField(db_column='Retainers', blank=True, null=True)  # Field name made lowercase.
    status = models.IntegerField(db_column='Status', blank=True, null=True)  # Field name made lowercase.
    sire = models.CharField(db_column='Sire', max_length=128, blank=True, null=True)  # Field name made lowercase.
    embraceyear = models.IntegerField(db_column='EmbraceYear', blank=True, null=True)  # Field name made lowercase.
    torpor = models.IntegerField()
    merit_1 = models.CharField(max_length=32)
    merit_2 = models.CharField(max_length=32)
    merit_3 = models.CharField(max_length=32)
    merit_4 = models.CharField(max_length=32)
    merit_5 = models.CharField(max_length=32)
    flaw_1 = models.CharField(max_length=32)
    flaw_2 = models.CharField(max_length=32)
    flaw_3 = models.CharField(max_length=32)
    flaw_4 = models.CharField(max_length=32)
    flaw_5 = models.CharField(max_length=32)


    def import_to_wawwod(self):
        from collector.models.creatures import Creature
        creature = Creature()
        creature.name = self.name
        creature.update_rid()
        rid = creature.rid
        for d in Creature.objects.filter(rid=rid):
            d.delete()
        creature.chronicle = 'NYC'
        creature.family = self.clan
        creature.player = self.player
        creature.position = self.role
        creature.creature = "kindred"
        creature.groupspec = self.coterie
        creature.nature = self.nature
        creature.demeanor = self.demeanor
        creature.level0 = self.conscience
        creature.level1 = self.selfcontrol
        creature.level2 = self.courage
        creature.power2 = self.bloodpool
        creature.faction = self.sect
        creature.sire = self.sire
        creature.age = random.randrange(18, 35)
        creature.embrace = self.embraceyear
        creature.willpower = self.willpower
        creature.timeintorpor = self.torpor
        creature.path = self.path
        creature.power1 = self.humanity
        creature.path = self.path

        creature.attribute0 = self.strength
        creature.attribute1 = self.dexterity
        creature.attribute2 = self.stamina
        creature.attribute3 = self.charisma
        creature.attribute4 = self.manipulation
        creature.attribute5 = self.appearance
        creature.attribute6 = self.perception
        creature.attribute7 = self.intelligence
        creature.attribute8 = self.wits

        creature.background0 = self.allies
        creature.background1 = self.contact
        creature.background2 = self.fame
        creature.background3 = self.generation
        creature.background4 = self.herd
        creature.background5 = self.influence
        creature.background6 = self.mentor
        creature.background7 = self.resources
        creature.background8 = self.retainers
        creature.background9 = self.status

        creature.talent0 = self.alertness
        creature.talent1 = self.athletics
        creature.talent2 = self.brawl
        creature.talent3 = self.dodge
        creature.talent4 = self.empathy
        creature.talent5 = self.expression
        creature.talent6 = self.intimidation
        creature.talent7 = self.leadership
        creature.talent8 = self.streetwise
        creature.talent9 = self.subterfuge

        creature.skill0 = self.animalken
        creature.skill1 = self.crafts
        creature.skill2 = self.drive
        creature.skill3 = self.etiquette
        creature.skill4 = self.firearms
        creature.skill5 = self.melee
        creature.skill6 = self.performance
        creature.skill7 = self.security
        creature.skill8 = self.stealth
        creature.skill9 = self.survival

        creature.knowledge0 = self.academics
        creature.knowledge1 = self.computer
        creature.knowledge2 = self.finance
        creature.knowledge3 = self.investigation
        creature.knowledge4 = self.law
        creature.knowledge5 = self.linguistics
        creature.knowledge6 = self.medicine
        creature.knowledge7 = self.occult
        creature.knowledge8 = self.politics
        creature.knowledge9 = self.science

        creature.merit0 = self.merit_1
        creature.merit1 = self.merit_2
        creature.merit2 = self.merit_3
        creature.merit3 = self.merit_4
        creature.merit4 = self.merit_5

        creature.flaw0 = self.flaw_1
        creature.flaw1 = self.flaw_2
        creature.flaw2 = self.flaw_3
        creature.flaw3 = self.flaw_4
        creature.flaw4 = self.flaw_5

        all_fields = CollectorNybnKindreds._meta.fields
        disciplines = []
        for f in all_fields:
            if f.name.startswith('disc_'):
                disciplines.append(f.name)
        last_fill = 0
        for d in disciplines:
            val = getattr(self,d)
            if val > 0:
                disc_str = d.replace('disc_', '').title()
                str = f'{disc_str} ({val})'
                setattr(creature, f'gift{last_fill}', str)
                last_fill += 1
        creature.need_fix = True
        creature.save()


def import_to_wawwod(modeladmin, request, queryset):
    for item in queryset:
        item.import_to_wawwod()
    short_description = 'Import to wawwod'


class CollectorNybnKindredsAdmin(admin.ModelAdmin):
    list_display = ['name', 'clan', 'sect']
    list_filter = ['clan', 'sect']
    actions = [ import_to_wawwod ]



class CollectorRanyGarous(models.Model):
    class Meta:
        managed = False
        db_table = 'collector_rany_garous'

    player = models.CharField(db_column='Player', max_length=32, blank=True, null=True)  # Field name made lowercase.
    name = models.CharField(db_column='Name', primary_key=True, max_length=128)  # Field name made lowercase.
    family = models.CharField(db_column='Family', max_length=32, blank=True, null=True)  # Field name made lowercase.
    auspice = models.IntegerField(db_column='Auspice', blank=True, null=True)  # Field name made lowercase.
    breed = models.IntegerField(db_column='Breed', blank=True, null=True)  # Field name made lowercase.
    group = models.CharField(db_column='Group', max_length=128, blank=True, null=True)  # Field name made lowercase.
    groupspec = models.CharField(db_column='GroupSpec', max_length=128, blank=True, null=True)  # Field name made lowercase.
    concept = models.CharField(db_column='Concept', max_length=128, blank=True, null=True)  # Field name made lowercase.
    strength = models.IntegerField(db_column='Strength', blank=True, null=True)  # Field name made lowercase.
    dexterity = models.IntegerField(db_column='Dexterity', blank=True, null=True)  # Field name made lowercase.
    stamina = models.IntegerField(db_column='Stamina', blank=True, null=True)  # Field name made lowercase.
    charisma = models.IntegerField(db_column='Charisma', blank=True, null=True)  # Field name made lowercase.
    manipulation = models.IntegerField(db_column='Manipulation', blank=True, null=True)  # Field name made lowercase.
    appearance = models.IntegerField(db_column='Appearance', blank=True, null=True)  # Field name made lowercase.
    perception = models.IntegerField(db_column='Perception', blank=True, null=True)  # Field name made lowercase.
    intelligence = models.IntegerField(db_column='Intelligence', blank=True, null=True)  # Field name made lowercase.
    wits = models.IntegerField(db_column='Wits', blank=True, null=True)  # Field name made lowercase.
    talent0 = models.IntegerField(db_column='Talent0', blank=True, null=True)  # Field name made lowercase.
    talent1 = models.IntegerField(db_column='Talent1', blank=True, null=True)  # Field name made lowercase.
    talent2 = models.IntegerField(db_column='Talent2', blank=True, null=True)  # Field name made lowercase.
    talent3 = models.IntegerField(db_column='Talent3', blank=True, null=True)  # Field name made lowercase.
    talent4 = models.IntegerField(db_column='Talent4', blank=True, null=True)  # Field name made lowercase.
    talent5 = models.IntegerField(db_column='Talent5', blank=True, null=True)  # Field name made lowercase.
    talent6 = models.IntegerField(db_column='Talent6', blank=True, null=True)  # Field name made lowercase.
    talent7 = models.IntegerField(db_column='Talent7', blank=True, null=True)  # Field name made lowercase.
    talent8 = models.IntegerField(db_column='Talent8', blank=True, null=True)  # Field name made lowercase.
    talent9 = models.IntegerField(db_column='Talent9', blank=True, null=True)  # Field name made lowercase.
    skill0 = models.IntegerField(db_column='Skill0', blank=True, null=True)  # Field name made lowercase.
    skill1 = models.IntegerField(db_column='Skill1', blank=True, null=True)  # Field name made lowercase.
    skill2 = models.IntegerField(db_column='Skill2', blank=True, null=True)  # Field name made lowercase.
    skill3 = models.IntegerField(db_column='Skill3', blank=True, null=True)  # Field name made lowercase.
    skill4 = models.IntegerField(db_column='Skill4', blank=True, null=True)  # Field name made lowercase.
    skill5 = models.IntegerField(db_column='Skill5', blank=True, null=True)  # Field name made lowercase.
    skill6 = models.IntegerField(db_column='Skill6', blank=True, null=True)  # Field name made lowercase.
    skill7 = models.IntegerField(db_column='Skill7', blank=True, null=True)  # Field name made lowercase.
    skill8 = models.IntegerField(db_column='Skill8', blank=True, null=True)  # Field name made lowercase.
    skill9 = models.IntegerField(db_column='Skill9', blank=True, null=True)  # Field name made lowercase.
    knowledge0 = models.IntegerField(db_column='Knowledge0', blank=True, null=True)  # Field name made lowercase.
    knowledge1 = models.IntegerField(db_column='Knowledge1', blank=True, null=True)  # Field name made lowercase.
    knowledge2 = models.IntegerField(db_column='Knowledge2', blank=True, null=True)  # Field name made lowercase.
    knowledge3 = models.IntegerField(db_column='Knowledge3', blank=True, null=True)  # Field name made lowercase.
    knowledge4 = models.IntegerField(db_column='Knowledge4', blank=True, null=True)  # Field name made lowercase.
    knowledge5 = models.IntegerField(db_column='Knowledge5', blank=True, null=True)  # Field name made lowercase.
    knowledge6 = models.IntegerField(db_column='Knowledge6', blank=True, null=True)  # Field name made lowercase.
    knowledge7 = models.IntegerField(db_column='Knowledge7', blank=True, null=True)  # Field name made lowercase.
    knowledge8 = models.IntegerField(db_column='Knowledge8', blank=True, null=True)  # Field name made lowercase.
    knowledge9 = models.IntegerField(db_column='Knowledge9', blank=True, null=True)  # Field name made lowercase.
    power1 = models.IntegerField(db_column='Power1', blank=True, null=True)  # Field name made lowercase.
    power2 = models.IntegerField(db_column='Power2', blank=True, null=True)  # Field name made lowercase.
    willpower = models.IntegerField(db_column='Willpower', blank=True, null=True)  # Field name made lowercase.
    level0 = models.IntegerField(db_column='Level0', blank=True, null=True)  # Field name made lowercase.
    level1 = models.IntegerField(db_column='Level1', blank=True, null=True)  # Field name made lowercase.
    level2 = models.IntegerField(db_column='Level2', blank=True, null=True)  # Field name made lowercase.
    rank = models.CharField(db_column='Rank', max_length=128, blank=True, null=True)  # Field name made lowercase.
    background0 = models.IntegerField(db_column='Background0', blank=True, null=True)  # Field name made lowercase.
    background1 = models.IntegerField(db_column='Background1', blank=True, null=True)  # Field name made lowercase.
    background2 = models.IntegerField(db_column='Background2', blank=True, null=True)  # Field name made lowercase.
    background3 = models.IntegerField(db_column='Background3', blank=True, null=True)  # Field name made lowercase.
    background4 = models.IntegerField(db_column='Background4', blank=True, null=True)  # Field name made lowercase.
    background5 = models.IntegerField(db_column='Background5', blank=True, null=True)  # Field name made lowercase.
    background6 = models.IntegerField(db_column='Background6', blank=True, null=True)  # Field name made lowercase.
    background7 = models.IntegerField(db_column='Background7', blank=True, null=True)  # Field name made lowercase.
    background8 = models.IntegerField(db_column='Background8', blank=True, null=True)  # Field name made lowercase.
    background9 = models.IntegerField(db_column='Background9', blank=True, null=True)  # Field name made lowercase.
    gift0 = models.CharField(db_column='Gift0', max_length=64, blank=True, null=True)  # Field name made lowercase.
    gift1 = models.CharField(db_column='Gift1', max_length=64, blank=True, null=True)  # Field name made lowercase.
    gift2 = models.CharField(db_column='Gift2', max_length=64, blank=True, null=True)  # Field name made lowercase.
    gift3 = models.CharField(db_column='Gift3', max_length=64, blank=True, null=True)  # Field name made lowercase.
    gift4 = models.CharField(db_column='Gift4', max_length=64, blank=True, null=True)  # Field name made lowercase.
    gift5 = models.CharField(db_column='Gift5', max_length=64, blank=True, null=True)  # Field name made lowercase.
    gift6 = models.CharField(db_column='Gift6', max_length=64, blank=True, null=True)  # Field name made lowercase.
    gift7 = models.CharField(db_column='Gift7', max_length=64, blank=True, null=True)  # Field name made lowercase.
    gift8 = models.CharField(db_column='Gift8', max_length=64, blank=True, null=True)  # Field name made lowercase.
    gift9 = models.CharField(db_column='Gift9', max_length=64, blank=True, null=True)  # Field name made lowercase.
    merit0 = models.CharField(db_column='Merit0', max_length=64, blank=True, null=True)  # Field name made lowercase.
    merit1 = models.CharField(db_column='Merit1', max_length=64, blank=True, null=True)  # Field name made lowercase.
    merit2 = models.CharField(db_column='Merit2', max_length=64, blank=True, null=True)  # Field name made lowercase.
    merit3 = models.CharField(db_column='Merit3', max_length=64, blank=True, null=True)  # Field name made lowercase.
    merit4 = models.CharField(db_column='Merit4', max_length=64, blank=True, null=True)  # Field name made lowercase.
    merit5 = models.CharField(db_column='Merit5', max_length=64, blank=True, null=True)  # Field name made lowercase.
    merit6 = models.CharField(db_column='Merit6', max_length=64, blank=True, null=True)  # Field name made lowercase.
    merit7 = models.CharField(db_column='Merit7', max_length=64, blank=True, null=True)  # Field name made lowercase.
    merit8 = models.CharField(db_column='Merit8', max_length=64, blank=True, null=True)  # Field name made lowercase.
    merit9 = models.CharField(db_column='Merit9', max_length=64, blank=True, null=True)  # Field name made lowercase.
    flaw0 = models.CharField(db_column='Flaw0', max_length=64, blank=True, null=True)  # Field name made lowercase.
    flaw1 = models.CharField(db_column='Flaw1', max_length=64, blank=True, null=True)  # Field name made lowercase.
    flaw2 = models.CharField(db_column='Flaw2', max_length=64, blank=True, null=True)  # Field name made lowercase.
    flaw3 = models.CharField(db_column='Flaw3', max_length=64, blank=True, null=True)  # Field name made lowercase.
    flaw4 = models.CharField(db_column='Flaw4', max_length=64, blank=True, null=True)  # Field name made lowercase.
    flaw5 = models.CharField(db_column='Flaw5', max_length=64, blank=True, null=True)  # Field name made lowercase.
    flaw6 = models.CharField(db_column='Flaw6', max_length=64, blank=True, null=True)  # Field name made lowercase.
    flaw7 = models.CharField(db_column='Flaw7', max_length=64, blank=True, null=True)  # Field name made lowercase.
    flaw8 = models.CharField(db_column='Flaw8', max_length=64, blank=True, null=True)  # Field name made lowercase.
    flaw9 = models.CharField(db_column='Flaw9', max_length=64, blank=True, null=True)  # Field name made lowercase.
    topic = models.CharField(db_column='Topic', max_length=128, blank=True, null=True)  # Field name made lowercase.
    status = models.CharField(db_column='Status', max_length=128)  # Field name made lowercase.
    maj = models.IntegerField()
    freebiedif = models.IntegerField(db_column='FreebieDif')  # Field name made lowercase.
    experience = models.IntegerField(db_column='Experience')  # Field name made lowercase.
    hidden = models.IntegerField(db_column='Hidden')  # Field name made lowercase.
    rite0 = models.CharField(db_column='Rite0', max_length=64)  # Field name made lowercase.
    rite1 = models.CharField(db_column='Rite1', max_length=64)  # Field name made lowercase.
    rite2 = models.CharField(db_column='Rite2', max_length=64)  # Field name made lowercase.
    rite3 = models.CharField(db_column='Rite3', max_length=64)  # Field name made lowercase.
    rite4 = models.CharField(db_column='Rite4', max_length=64)  # Field name made lowercase.
    rite5 = models.CharField(db_column='Rite5', max_length=64)  # Field name made lowercase.
    rite6 = models.CharField(db_column='Rite6', max_length=64)  # Field name made lowercase.
    rite7 = models.CharField(db_column='Rite7', max_length=64)  # Field name made lowercase.
    rite8 = models.CharField(db_column='Rite8', max_length=64)  # Field name made lowercase.
    rite9 = models.CharField(db_column='Rite9', max_length=64)  # Field name made lowercase.
    rite10 = models.CharField(db_column='Rite10', max_length=64)  # Field name made lowercase.
    rite11 = models.CharField(db_column='Rite11', max_length=64)  # Field name made lowercase.
    rite12 = models.CharField(db_column='Rite12', max_length=64)  # Field name made lowercase.
    rite13 = models.CharField(db_column='Rite13', max_length=64)  # Field name made lowercase.
    rite14 = models.CharField(db_column='Rite14', max_length=64)  # Field name made lowercase.
    rite15 = models.CharField(db_column='Rite15', max_length=64)  # Field name made lowercase.
    visibility = models.IntegerField(db_column='Visibility')  # Field name made lowercase.
    gift10 = models.CharField(db_column='Gift10', max_length=64)  # Field name made lowercase.
    gift11 = models.CharField(db_column='Gift11', max_length=64)  # Field name made lowercase.
    gift12 = models.CharField(db_column='Gift12', max_length=64)  # Field name made lowercase.
    gift13 = models.CharField(db_column='Gift13', max_length=64)  # Field name made lowercase.
    gift14 = models.CharField(db_column='Gift14', max_length=64)  # Field name made lowercase.
    gift15 = models.CharField(db_column='Gift15', max_length=64)  # Field name made lowercase.
    gift16 = models.CharField(db_column='Gift16', max_length=64)  # Field name made lowercase.
    gift17 = models.CharField(db_column='Gift17', max_length=64)  # Field name made lowercase.
    gift18 = models.CharField(db_column='Gift18', max_length=64)  # Field name made lowercase.
    gift19 = models.CharField(db_column='Gift19', max_length=64)  # Field name made lowercase.
    rite16 = models.CharField(db_column='Rite16', max_length=64)  # Field name made lowercase.
    rite17 = models.CharField(db_column='Rite17', max_length=64)  # Field name made lowercase.
    rite18 = models.CharField(db_column='Rite18', max_length=64)  # Field name made lowercase.
    rite19 = models.CharField(db_column='Rite19', max_length=64)  # Field name made lowercase.
    faction = models.CharField(db_column='Faction', max_length=64)  # Field name made lowercase.
    lastmod = models.DateTimeField()
    chronicle = models.CharField(max_length=8)
    creature = models.CharField(max_length=20)
    sex = models.IntegerField()
    trueage = models.IntegerField(db_column='TrueAge')  # Field name made lowercase.

