FROM node:alpine3.15

WORKDIR /api

EXPOSE 3000
EXPOSE 5432

# Download nodes_modules + start 
ENTRYPOINT npm ci && npm run start:prod