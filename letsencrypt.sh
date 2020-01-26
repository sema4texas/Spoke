#!/bin/bash

# Note: 
# The --standalone flag spins up a temporary webserver,
# that allows certbot to complete the ACME challenge.
# This is why we need to docker-compose down before
# running the container to free up port 80.

docker-compose down;

docker run -it --rm --name certbot \
  -v /spoke/letsencrypt/lib:/var/lib/letsencrypt \
  -v /spoke/letsencrypt/etc:/etc/letsencrypt \
  -v /spoke/letsencrypt/log/:/var/log/letsencrypt \
  -p 80:80 \
  certbot/certbot -t certonly \
  --standalone \
  --email tech@sema4texas.com \
  --no-eff-email \
  --agree-tos --renew-by-default \
  --dry-run \
  -d text.sema4texas.com;

docker-compose up -d
