FROM node:16.14-alpine

WORKDIR /api

EXPOSE 3000
EXPOSE 5432

# Download nodes_modules + start 
ENTRYPOINT npm ci && npm run start