FROM node:10 AS node_builder

COPY . /emqx-dashboard-frontend
WORKDIR /emqx-dashboard-frontend

RUN yarn install && yarn build
