FROM node:18.9.0


WORKDIR /app

COPY . .

RUN npm ci


EXPOSE 3000


CMD ["npm", "start"]