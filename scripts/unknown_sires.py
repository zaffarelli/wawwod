from collector.models.creatures import Creature
import json


def cleanup_spare_unknown():
  action = 0
  print("=> Removing 'Unknown...' without infans")      
  all = Creature.objects.filter(creature='kindred',name__contains='Unknown')
  for kindred in all:
    infans = Creature.objects.filter(sire=kindred.name)
    if infans is None:
      print(" --> Deleting [%s]: No infans."%(kindred.name))      
      kindred.delete()
      action += 1
    if kindred.background3 >= 10:
      print(" --> Deleting [%s]: Generation is too low"%(kindred.name))      
      kindred.delete()
      action += 1
  return action

def cleanup_false_unknown_reference():
  action = 0
  print("=> Removing 'Unknown...' sire if they don't exist")
  all = Creature.objects.filter(creature='kindred',sire__contains='Unknown')
  for kindred in all:
    sire = Creature.objects.filter(name=kindred.sire).first()
    if sire is None:
      print(" --> No sire [%s] found for [%s]: Updating kindred."%(kindred.sire,kindred.name))      
      kindred.sire = ''
      kindred.save()
      action += 1
  return action

def create_named_sires():
  action = 0
  print("=> Creating Sires")      
  all = Creature.objects.filter(creature='kindred').exclude(sire='').exclude(background3__gte=8)
  for kindred in all:
    sire = Creature.objects.filter(creature='kindred',name=kindred.sire).first()
    if sire is None:
      embracer = Creature()
      embracer.background3 = kindred.background3+1
      embracer.family = kindred.family
      embracer.name = kindred.sire
      embracer.ghost = True
      embracer.save()
      print(" --> Sire [%s] created for [%s]"%(embracer.name,kindred.name))
      action += 1
  return action

def create_sires():
  action = 0
  print("=> Siring 'Unknown...'")      
  all_sireless = Creature.objects.filter(creature='kindred',sire='',background3__lte=7)
  ghost_sires = {}
  for kindred in all_sireless:
    str = "Unknown %dth generation %s"%(13-(kindred.background3+1),kindred.root_family())
    grandsire= "Unknown %dth generation %s"%(13-(kindred.background3+2),kindred.root_family())
    if (kindred.background3+2 == 10):
      if kindred.root_family() in ['Toreador','Daughter of Cacophony'] :
        grandsire = 'Arikel'
      elif kindred.root_family() == 'Malkavian':
        grandsire = 'Malkav'
      elif kindred.root_family() == 'Salubri':
        grandsire = 'Saulot'
      elif kindred.root_family() == 'Gangrel':
        grandsire = 'Ennoia'
      elif kindred.root_family() == 'Ventrue':
        grandsire = 'Ventru'
      elif kindred.root_family() == 'Cappadocian':
        grandsire = 'Cappadocius'
      elif kindred.root_family() == 'Nosferatu':
        grandsire = 'Absimiliard'
      elif kindred.root_family() == 'Ravnos':
        grandsire = 'Dracian'
      elif kindred.root_family() == 'Setite':
        grandsire = 'Set'
      elif kindred.root_family() == 'Assamite':
        grandsire = 'Haqim'
      elif kindred.root_family() in ['Lasombra','Kiasyd']:
        grandsire = 'Lasombra'
      elif kindred.root_family() == 'Tzimisce':
        grandsire = 'The Eldest'
      elif kindred.root_family() == 'Brujah':
        grandsire = 'Brujah'      
    elif (kindred.background3+2 == 9):
      if kindred.root_family() == 'Giovanni':
        grandsire = 'Augustus Giovanni'
      elif kindred.root_family() == 'Tremere':
        grandsire = 'Tremere'
      elif kindred.root_family() == 'Brujah':
        grandsire = 'Troile'      
    j = {"ghost":True,"family":kindred.root_family(),"background3":kindred.background3+1,"name":str,"sire":grandsire}    
    ghost_sires[str] = j
    kindred.sire = str
    kindred.save()
    action += 1
  print("=> Kindred sires to be created")
  print(json.dumps(ghost_sires,indent=2))
  print("=> Creating Linked Ghosts")  
  for key in ghost_sires:
    gs = ghost_sires[key]
    print(" ----> Dealing with ghost %s"%(gs['name']))
    f = Creature.objects.filter(name=gs['name']).first()
    if f is None:
      t = Creature()
      t.name = gs['name']
      t.background3 = gs['background3']
      t.family = gs['family']
      t.ghost = gs['ghost']
      t.sire = gs['sire']
      t.save()
      print(" --> Adding ghost %s"%(t.name))
      action += 1
  return action

def check_caine_roots():
  action = 0
  while action>0:
    action = cleanup_spare_unknown():
    action += cleanup_false_unknown_reference():
    action += create_named_sires():
    action += create_sires():
    print("Number of actions executed: %d"%(action))
  x = Creature.objects.filter(creature='kindred',name="Caine").first()
  data = x.find_lineage()
  with open('/home/zaffarelli/Projects/wawwod/collector/static/js/kindred.json', 'w') as fp:
    json.dump(data, fp)
  print("--> Lineage Done")

