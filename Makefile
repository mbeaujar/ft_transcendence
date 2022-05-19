CMD=docker-compose
FILE=docker-compose.yml
DATABASE_NAME=database

# Docker image: https://hub.docker.com/_/postgres
# CMD Copy -> docker run --name pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:alpine3.15

.SILENT:

all: $(FILE)
	$(CMD) up

start: $(FILE)
	$(CMD) start

# FUCK ALI
dbstart: 
	@echo "${RED}Starting new fresh instance of $(NAME)${NC}"
	@docker run --name $(NAME) \
		-e POSTGRES_PASSWORD=$(PASSWORD) \
		-e POSTGRES_USER=$(USER) \
		-e POSTGRES_DB=$(DB) \
		-p 5432:5432 \
		-d postgres:alpine3.15
	@echo "${RED}Starting new fresh instance of $(ADMIN_NAME)${NC}"
	@ docker run --name $(ADMIN_NAME) \
		-e PGADMIN_DEFAULT_EMAIL=$(EMAIL) \
		-e PGADMIN_DEFAULT_PASSWORD=$(PGPASSWORD) \
		-e PGADMIN_LISTEN_PORT=5050 \
		-p 5050:5050 \
		-d dpage/pgadmin4
	@echo "${RED}make dbstop to stop the container $(NAME) and $(ADMIN_NAME) ${NC}"


dbstop:
	@echo "${RED}Stop and remove old docker $(NAME)${NC}"
	@-docker kill $(NAME)
	@-docker kill $(ADMIN_NAME)
	@-docker rm $(NAME)
	@-docker rm $(ADMIN_NAME)

dbre: dbstop dbstart

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


