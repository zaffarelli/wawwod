#!/bin/bash
mkdir -p ./backup/$1
echo "Collector Objects"
uv run ./manage.py dumpdata --format xml collector.Chronicle --output backup/$1/chronicles.xml
uv run ./manage.py dumpdata --format xml collector.Rite --output backup/$1/rites.xml
uv run ./manage.py dumpdata --format xml collector.Gift --output backup/$1/gifts.xml
uv run ./manage.py dumpdata --format xml collector.Discipline --output backup/$1/disciplines.xml
uv run ./manage.py dumpdata --format xml collector.Adventure --output backup/$1/adventures.xml
uv run ./manage.py dumpdata --format xml collector.Background --output backup/$1/backgrounds.xml
uv run ./manage.py dumpdata --format xml collector.Archetype --output backup/$1/archetypes.xml
uv run ./manage.py dumpdata --format xml collector.Deed --output backup/$1/deeds.xml
uv run ./manage.py dumpdata --format xml collector.Season --output backup/$1/seasons.xml
uv run ./manage.py dumpdata --format xml collector.Sept --output backup/$1/septs.xml
uv run ./manage.py dumpdata --format xml collector.Creature --output backup/$1/creatures.xml
echo "Storytelling Objects"
uv run ./manage.py dumpdata --format xml storytelling.Story --output backup/$1/stories.xml
uv run ./manage.py dumpdata --format xml storytelling.City --output backup/$1/cities.xml
uv run ./manage.py dumpdata --format xml storytelling.District --output backup/$1/districts.xml
uv run ./manage.py dumpdata --format xml storytelling.HotSpot --output backup/$1/hotspots.xml
uv run ./manage.py dumpdata --format xml storytelling.Place --output backup/$1/places.xml
uv run ./manage.py dumpdata --format xml storytelling.Scene --output backup/$1/scenes.xml

#echo "Prepare Fixtures"
#python ./manage.py dump_object --format xml collector.Creature bismark terri_brandt niklas_waldkauz vidar_grimsdottir albrecht_tiberius adel_the_swift leon_fritzmann camilla > collector/fixtures/creatures.xml