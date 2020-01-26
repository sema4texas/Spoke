#!/bin/bash

# Note: 
# The --standalone flag spins up a temporary webserver,
# that allows certbot to complete the ACME challenge.
# This is why we need to docker-compose down before
# running the container to free up port 80.
# The "-u" argument makes the container run as UID 33, 
# which is the www-data user on Ubuntu used for web servers.
# We don't need a random webserver running as root, eh?

docker-compose down;

docker run -it --rm --name certbot \
  -v /spoke/letsencrypt:/etc/letsencrypt \
  -v /spoke/letsencypt/log/:/var/log/letsencrypt \
  -p 80:80 \
  -u 33 \
  certbot/certbot -t certonly \
  --standalone \
  --email tech@sema4texas.com \
  --no-eff-email \
  --agree-tos --renew-by-default \
  -d text.sema4texas.com;

#docker-compose up -d
