FROM node:20-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:20-alpine

WORKDIR /ui

COPY --from=builder /app .

EXPOSE 3000

CMD ["yarn", "start"]