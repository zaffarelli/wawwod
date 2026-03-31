#!/bin/bash
sudo fuser -k 8090/tcp
uv run ./manage.py makemigrations
uv run ./manage.py migrate
uv run ./manage.py collectstatic --noinput
uv run ./manage.py runserver 0.0.0.0:8090