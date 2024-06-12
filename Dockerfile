FROM node:18.19.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx playwright install

RUN npx playwright install-deps 

RUN npm run build

CMD ["sh", "-c", "npm run start"]