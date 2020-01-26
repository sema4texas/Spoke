#!/bin/bash

docker-compose down;

docker run -it --rm --name certbot \
  -v /spoke/letsencrypt:/etc/letsencrypt \
  -v /var/log/letsencrypt:/var/log/letsencrypt \
  -p 80:80
  letsencrypt/letsencrypt -t certonly \
  --dry-run \
  --agree-tos --renew-by-default \
  -d text.sema4texas.com;

docker-compose up -d
  