FROM node:16.3.0-alpine as base
ARG DB_CONNECTION=$DB_CONNECTION
ARG GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET

#Set workdir in the container
WORKDIR /usr/src/app

#Create directory structure
RUN mkdir backend/
RUN mkdir frontend/

# Copying this separately prevents re-running npm install on every code change.
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install production dependencies.
RUN cd backend/ && npm install
RUN cd frontend/ && npm install

# Copy local code to the container image.
COPY ./backend ./backend/
COPY ./frontend ./frontend/

#Second docker stage for caching purposes
FROM base as production

#Specify dir
ENV NODE_PATH=./build

#run backend builder
RUN cd backend/ && npm run build

#run frontend builder
RUN cd frontend/ && npm run build

#Copy frontend build files into backend public folder
RUN cp frontend/dist/* backend/public/

WORKDIR /usr/src/app/backend

# Run the web service on container startup.
CMD [ "npm", "start" ]
