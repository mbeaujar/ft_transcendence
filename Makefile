
NAME=pg
PASSWORD=postgres
USER=postgres
DB=postgres
CMD=docker-compose
RED=\033[0;31m
NC=\033[0m # No Color

# Docker image: https://hub.docker.com/_/postgres
# CMD Copy -> docker run --name pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:alpine3.15

all:
	@$(CMD) up --build

dbstart: 
	@echo "${RED}Starting new fresh instance of $(NAME)${NC}"
	@docker run --name $(NAME) \
		-e POSTGRES_PASSWORD=$(PASSWORD) \
		-e POSTGRES_USER=$(USER) \
		-e POSTGRES_DB=$(DB) \
		-p 5432:5432 \
		-d postgres:alpine3.15
	@echo "${RED}make dbstop to stop the container $(NAME)${NC}"


dbstop:
	@echo "${RED}Stop and remove old docker $(NAME)${NC}"
	@docker kill $(NAME)
	@docker rm $(NAME)

down:
	@$(CMD) down

clear:
	@$(CMD) down --rmi all


