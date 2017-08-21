FROM node:8.4.0
WORKDIR /home/weave
COPY . /home/weave/
RUN yarn --pure-lockfile --ignore-scripts
RUN npm rebuild --silent node-sass
