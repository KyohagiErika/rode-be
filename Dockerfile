FROM node:16 as builder
WORKDIR /app
COPY . .
COPY .env.deploy .env
RUN npm install -f
RUN npm run build

FROM ubuntu:22.04
RUN apt-get update
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs
RUN apt-get install -y build-essential
RUN apt-get install -y openjdk-8-jdk
RUN node -v
RUN npm -v
WORKDIR /app
COPY --from=builder /app .