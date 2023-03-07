# Install nodejs and yarn from https://nodejs.org/en/download/ and https://classic.yarnpkg.com/en/docs/install/#windows-stable
# Install Docker Desktop: https://www.docker.com/products/docker-desktop
# docker login --username="username" --password="password" "docker hub url"
# Create Image: docker build -t "image name":"tag" .
# Run MongoDB detach mode: docker run -p 27017:27017 --name "container name" -d mongo
# Run container detach mode: docker run -p 8000 --env-file .env -d --rm --name "conatiner name" -v "Absolute path source:/app" -v /app/node_modules "image name":"tag"

FROM node:18-alpine

# arguments for the build
ARG DEFAULT_PORT=8000

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json /app

RUN yarn

# Bundle app source
COPY . /app

ENV PORT=$DEFAULT_PORT

EXPOSE $PORT

# VOLUME [ "C:\Users\bayir\Desktop\devs\ppapp\dnd\express:/app" , "/app/node_modules" ]

CMD [ "yarn", "start" ]