### STAGE 1: Build ###
# defining version of the base image
FROM node:alpine as build

# defining work directory
WORKDIR /app

# copying the json files into the image
COPY package*.json ./

RUN npm install

# copying rest of project
COPY . .

# running build script
RUN npm run build --prod

### STAGE 2: Setup ###
# defining nginx image version
FROM nginx:alpine

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# copy dist output from our first image
COPY --from=build /app/dist/StockPred /usr/share/nginx/html

# copy nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD [ "nginx", "-g", "daemon off;" ]
