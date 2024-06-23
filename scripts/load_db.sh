#!/bin/bash
echo "Collector Objects"
python ./manage.py loaddata backup/$1/chronicles.xml
python ./manage.py loaddata backup/$1/adventure.xml
python ./manage.py loaddata backup/$1/archetypes.xml
python ./manage.py loaddata backup/$1/rites.xml
python ./manage.py loaddata backup/$1/gifts.xml
python ./manage.py loaddata backup/$1/disciplines.xml
python ./manage.py loaddata backup/$1/backgrounds.xml
python ./manage.py loaddata backup/$1/creatures.xml

echo "Storytelling Objects"
python ./manage.py loaddata backup/$1/stories.xml
python ./manage.py loaddata backup/$1/cities.xml
python ./manage.py loaddata backup/$1/districts.xml
python ./manage.py loaddata backup/$1/hotspots.xml
python ./manage.py loaddata backup/$1/places.xml
python ./manage.py loaddata backup/$1/scenes.xml


#python ./manage.py loaddata backup/creatures_split/2024_05_2902_01_53_011/creature*.xml

#python ./manage.py loaddata backup/creatures_split/2024_05_2902_01_53_011/_creature*.xml