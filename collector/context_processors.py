'''
           /       '_ /_/ 
          ()(/__/)/(//)/  
            /     _/      

'''
from collector.utils import wod_reference
from django.conf import settings

def commons(request):
  chronicle = wod_reference.get_current_chronicle()
  context = { 'chronicle': chronicle.acronym,'chronicle_name':chronicle.name,'chronicle_logo': "collector/"+chronicle.image_logo}
  return context
