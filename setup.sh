#!/bin/bash

########################################################################
#                                                                      #
#                   Tripwire Docker Installer Script                   #
#                                                                      #
########################################################################

#get variables
echo "Please enter the Traefik email"
read -r ADM_EMAIL

echo "Please enter the domain name for tripwire"
read -r TRDOMAIN

echo "Please enter the mysql root password to be set"
read -r MYSQL_ROOT_PASSWO

echo "Please enter the mysql user name to be set"
read -r MYSQL_USER

echo "Please enter the mysql user password to be set"
read -r MYSQL_PASSWORD

echo "What is the EVE SSE clientID?"
read -r SSO_CLIENT

echo "What is the EVE SSE secretID?"
read -r SSO_SECRET

#set up php files
cp db.inc.docker.example.php db.inc.php
cp config.example.php config.php

#set up config
sed -i -e "s/your@email.com/$ADM_EMAIL/g; s/your domain/$TRDOMAIN/g; s/\(apasswordforroot\|samerootpasswordasabove\)/$MYSQL_ROOT_PASSWO/g; s/norootuser/$MYSQL_USER/g; s/anonrootpassword/$MYSQL_PASSWORD/g" ./docker-compose.yml
sed -i -e "s/usernamefromdockercompose/$MYSQL_USER/g; s/userpasswordfromdockercompose/$MYSQL_PASSWORD/g" ./db.inc.php
sed -i -e "s/\(your domain\|yourdomain\)/$TRDOMAIN/g; s/adminEmail@example.com/$ADM_EMAIL/g; s/client/$SSO_CLIENT/g; s/secret/$SSO_SECRET/g" ./config.php

#setup traefik
mkdir -p traefik-data
touch traefik-data/acme.json
chmod 600 traefik-data/acme.json

#add crontab entries
crontab -l | cat - crontab-tw.txt >/tmp/crontab.txt && crontab /tmp/crontab.txt
