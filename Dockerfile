# Step 1: Build QualiExplore app in image 'builder'

FROM node:12.8-alpine AS builder

LABEL maintainer="Shantanoo Desai <des@biba.uni-bremen.de>"

WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build


# Step 2: Use the build output from 'builder' image

FROM nginx:stable-alpine
LABEL version="1.0"

COPY nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist/qualiexplore/ .
