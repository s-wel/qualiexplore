# Step 1: Build QualiExplore app in image 'builder'

FROM node:12.8-alpine AS builder

LABEL maintainer="Stefan Wellsandt <wel@biba.uni-bremen.de>"

WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build


# Step 2: Use the build output from 'builder' image

FROM nginx:stable-alpine
LABEL version="1.0"

LABEL git.commit.hash=""
LABEL git.commit.branch=""

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/ssl.conf.template /etc/nginx/ssl.conf.template

WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist/qualiexplore/ .
