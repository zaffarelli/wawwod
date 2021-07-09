'''
           /       '_ /_/ 
          ()(/__/)/(//)/  
            /     _/      

'''
from django import forms
from django.forms import ModelForm
from collector.models.creatures import Creature

class CreatureForm(ModelForm):
  class Meta:
    model = Creature
    fields = '__all__'
