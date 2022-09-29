FROM node:16-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . ./
RUN yarn build

ENV NODE_ENV production
ENV PORT=80
EXPOSE 80

# start app
CMD ["yarn", "start"]