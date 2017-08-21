FROM node:8.4.0
WORKDIR /home/weave
ENV NPM_CONFIG_LOGLEVEL=warn NPM_CONFIG_PROGRESS=false
COPY yarn.lock package.json .babelrc .eslintrc webpack.config.js /home/weave/
COPY src /home/weave/src
RUN yarn --pure-lockfile
