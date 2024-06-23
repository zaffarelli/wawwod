#!/bin/bash
mkdir -p ./backup/$1
echo "Collector Objects"
python ./manage.py dumpdata --format xml collector.Chronicle --output backup/$1/chronicles.xml
python ./manage.py dumpdata --format xml collector.Rite --output backup/$1/rites.xml
python ./manage.py dumpdata --format xml collector.Gift --output backup/$1/gifts.xml
python ./manage.py dumpdata --format xml collector.Discipline --output backup/$1/disciplines.xml
python ./manage.py dumpdata --format xml collector.Adventure --output backup/$1/adventure.xml
python ./manage.py dumpdata --format xml collector.Background --output backup/$1/backgrounds.xml
python ./manage.py dumpdata --format xml collector.Archetype --output backup/$1/archetypes.xml
python ./manage.py dumpdata --format xml collector.Creature --output backup/$1/creatures.xml
echo "Storytelling Objects"
python ./manage.py dumpdata --format xml storytelling.Story --output backup/$1/stories.xml
python ./manage.py dumpdata --format xml storytelling.City --output backup/$1/cities.xml
python ./manage.py dumpdata --format xml storytelling.District --output backup/$1/districts.xml
python ./manage.py dumpdata --format xml storytelling.HotSpot --output backup/$1/hotspots.xml
python ./manage.py dumpdata --format xml storytelling.Place --output backup/$1/places.xml
python ./manage.py dumpdata --format xml storytelling.Scene --output backup/$1/scenes.xml

#echo "Prepare Fixtures"
#python ./manage.py dump_object --format xml collector.Creature bismark terri_brandt niklas_waldkauz vidar_grimsdottir albrecht_tiberius adel_the_swift leon_fritzmann camilla > collector/fixtures/creatures.xml