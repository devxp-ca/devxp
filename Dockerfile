FROM node:18.1.0-alpine as base
ARG DB_CONNECTION=$DB_CONNECTION
ARG GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET

#Set workdir in the container
WORKDIR /usr/src/app

#Create directory structure
RUN mkdir backend/
RUN mkdir frontend/

RUN npm install -g pnpm@7

# Copying this separately prevents re-running npm install on every code change.
COPY backend/package*.json backend/*-lock.* ./backend/
COPY frontend/package*.json frontend/*-lock.* ./frontend/


# Install production dependencies.
RUN cd backend/ && pnpm install --prefer-frozen-lockfile
RUN cd frontend/ && npm ci

# Copy local code to the container image.
COPY ./backend ./backend/
COPY ./frontend ./frontend/

#Second docker stage for caching purposes
FROM base as production

#Specify dir
ENV NODE_PATH=./build

#run backend builder
RUN cd backend/ && pnpm run build

#run frontend builder
RUN cd frontend/ && pnpm run build

#Copy frontend build files into backend public folder
RUN cp frontend/dist/* backend/public/

RUN cd frontend && pnpm prune --prod && cd ../backend && pnpm prune --prod

WORKDIR /usr/src/app/backend

# Run the web service on container startup.
CMD [ "npm", "start" ]
