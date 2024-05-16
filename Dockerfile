# Step 1: Build QualiExplore app in image 'builder'

FROM node:16.14.2-alpine AS builder

LABEL name="QualiExplore"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# Use the production environment
RUN npm run build --prod


# Step 2: Use the build output from 'builder' image

FROM nginx:stable-alpine
LABEL version="2.1"

COPY nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist/qualiexplore/ .
