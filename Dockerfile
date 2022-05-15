# Set which version of node you are using
FROM node:16

# Create working app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install required packages to run app
RUN npm install

# Bundle app source
COPY . .
RUN npm run build:prod

# The port that the app will run on
EXPOSE 3001

# Command to start the app 
CMD [ "npm", "run", "start:prod" ]