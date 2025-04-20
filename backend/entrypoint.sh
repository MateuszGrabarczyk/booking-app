#!/usr/bin/env bash
set -e

# 1) wait for Postgres
until pg_isready -h db -U "$POSTGRES_USER"; do
  echo "Waiting for Postgres…"
  sleep 1
done

# 2) migrate
python manage.py migrate --noinput

# 3) ensure we have a superuser
#    default to admin/admin@example.com/admin if nothing else is set
export DJANGO_SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL:-admin@example.com}
export DJANGO_SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD:-admin}

python manage.py createsuperuser \
  --no-input \
  --email    "$DJANGO_SUPERUSER_EMAIL" \
|| echo "Superuser already exists, skipping."

# 4) fire up the dev server
exec python manage.py runserver 0.0.0.0:8000
