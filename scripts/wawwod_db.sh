#!/usr/bin/bash
docker run --name wawwod2_db \
        -e POSTGRES_DB=wawwod \
        -e POSTGRES_USER=wawwod \
        -e POSTGRES_PASSWORD=wawwod \
        -e PGDATA=/var/lib/postgresql/data/pgdata \
        -p 5442:5432 \
        -d postgres:16
