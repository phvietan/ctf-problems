#!/bin/bash

if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

docker build -t funny-express .

docker run -d -p ${PORT}:${PORT} --rm -it funny-express