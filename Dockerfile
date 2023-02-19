FROM node:16 as builder
WORKDIR /app
COPY . .
COPY .env.deploy .env
RUN npm install -f
RUN npm run build

FROM ubuntu:22.04
RUN apt-get update
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - &&\
RUN sudo apt-get install -y nodejs
RUN apt-get install build-essential
RUN apt-get install openjdk-8-jdk
WORKDIR /app
COPY --from=builder /app/dist .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env .
