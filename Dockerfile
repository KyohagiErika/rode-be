FROM node:16-alpine
RUN apk install build-essential
RUN apk add openjdk8 
WORKDIR /app
COPY . .
COPY .env.deploy .env
RUN npm install -f
RUN npm run build
CMD ["npm", "run", "start:prod"]