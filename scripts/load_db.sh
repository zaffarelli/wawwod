#!/bin/bash
echo "Collector Objects"
python ./manage.py loaddata backup/$1/gifts.xml
python ./manage.py loaddata backup/$1/rites.xml
python ./manage.py loaddata backup/$1/chronicles.xml
python ./manage.py loaddata backup/$1/creatures.xml

echo "Storytelling Objects"
python ./manage.py loaddata backup/$1/stories.xml
python ./manage.py loaddata backup/$1/places.xml
python ./manage.py loaddata backup/$1/scenes.xml

