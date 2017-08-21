FROM node:8.4.0
WORKDIR /home/weave
ENV NPM_CONFIG_LOGLEVEL=warn NPM_CONFIG_PROGRESS=false
COPY yarn.lock package.json .babelrc .eslintrc index.js styles.scss webpack.config.js /home/weave/
RUN yarn --pure-lockfile --ignore-scripts
RUN npm --quiet rebuild node-sass
