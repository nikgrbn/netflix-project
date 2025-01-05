FROM node:22

COPY .. /usr/src/netflix-project
WORKDIR /usr/src/netflix-project/web

# install npm dependencies
RUN npm install

ENV NODE_ENV=production

ENTRYPOINT ["npm","start"]