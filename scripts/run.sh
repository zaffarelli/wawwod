#!/bin/bash
sudo fuser -k 8090/tcp
python ./manage.py makemigrations
python ./manage.py migrate
python ./manage.py collectstatic --noinput
python ./manage.py runserver 0.0.0.0:8090