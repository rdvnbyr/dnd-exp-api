# Install nodejs and yarn
# Install Docker Desktop
# first build the image with the command$: docker build -t dnd:latest .
# then run the container with the command$: docker run -p 8000 --env-file .env -d --rm --name dndapp -v feedback:/app/data -v [absolut path]:/app -v /app/node_modules dnd:latest

# docker login
# docker build -t dnd:volumes .
# docker run -p 8000 --env-file .env -d --rm --name dndapp -v feedback:/app/data -v "C:\Users\bayir\Desktop\devs\ppapp\dnd\express:/app" -v /app/node_modules dnd:volumes
# docker pull mongo
# docker run -p 27017:27017 --name mongodb -d mongo

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

# VOLUME [ "feedback:/app/data", "C:\Users\bayir\Desktop\devs\ppapp\dnd\express:/app" , "/app/node_modules" ]

CMD [ "yarn", "start" ]