#!/bin/bash

export DOCKER_IP=$(/sbin/ip -o -4 addr list docker0 | awk '{print $4}' | cut -d/ -f1)

if [ -f .env ]
then
  if ! grep DOCKER_IP .env ; then
    echo -ne "\nDOCKER_IP=${DOCKER_IP}" >> .env
  fi
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

sudo rm -rf db/*
sudo docker-compose build
sudo docker-compose up -d