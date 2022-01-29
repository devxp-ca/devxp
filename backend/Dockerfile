FROM node:16.3.0-alpine as base
ARG DB_CONNECTION=$DB_CONNECTION

WORKDIR /usr/src/app

# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . ./

#Second docker stage for caching purposes
FROM base as production

#Specify dir
ENV NODE_PATH=./build

#run our builder
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "start" ]
