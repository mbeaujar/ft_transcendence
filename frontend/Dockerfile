FROM node:16.14-alpine

WORKDIR /app

ENV PORT 8080
EXPOSE 8080

# Download nodes_modules + start 
ENTRYPOINT npm ci && npm run start