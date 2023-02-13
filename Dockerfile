FROM node:16
WORKDIR /app
COPY . .
RUN npm install -f
RUN npm run build
CMD ["npm", "run", "start:prod"]