#!/bin/bash
python ./manage.py loaddata backup/$1/chronicles.xml
python ./manage.py loaddata backup/$1/creatures.xml
