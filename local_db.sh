#!/bin/bash

# Docker image: https://hub.docker.com/_/postgres

SERVER="pg";
PASSWORD="postgres";
USER="postgres";
DB="postgres ";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
	docker run --name $NAME \
	-e POSTGRES_PASSWORD=$PASSWORD \
	-e POSTGRES_USER=$USER \
	-e POSTGRES_DB=$DB \
	-p 5432:5432 \
	-d postgres:alpine3.15

# CMD Copy -> docker run --name pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:alpine3.15