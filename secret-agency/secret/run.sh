#!/bin/bash

if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

sudo docker build -t secret-agency .

sudo docker run -d -p ${PORT}:${PORT} --rm -it secret-agency