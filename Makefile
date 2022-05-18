CMD=docker-compose
FILE=docker-compose.yml
DATABASE_NAME=db

# Docker image: https://hub.docker.com/_/postgres
# CMD Copy -> docker run --name pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:alpine3.15

.SILENT:

all: $(FILE)
	$(CMD) up

start: $(FILE)
	$(CMD) start

stop: $(FILE)
	$(CMD) stop

dbip:
	docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(DATABASE_NAME)

build: $(FILE)
	$(CMD) up --build

down: $(FILE)
	$(CMD) down

clear: $(FILE)
	$(CMD) down --rmi all


