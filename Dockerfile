FROM node:16
RUN apt-get update
RUN apt-get install build-essential
RUN apt-get install openjdk-8-jdk
WORKDIR /app
COPY . .
COPY .env.deploy .env
RUN npm install -f
RUN npm run build
CMD ["npm", "run", "start:prod"]