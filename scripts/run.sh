#!/bin/bash

sudo fuser -k 8090/tcp
python ./manage.py makemigrations
python ./manage.py migrate
#python ./manage.py yarn install
python ./manage.py collectstatic --noinput
#python ./manage.py dumpdata collector.Chronicle --format xml --output backup/chronicles.xml
#python ./manage.py dumpdata collector.Creature --format xml --output backup/creatures.xml
python ./manage.py runserver 0.0.0.0:8090