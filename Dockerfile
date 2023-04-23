# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory
WORKDIR /usr/src/

# Copy package.json and package-lock.json (if available) into the working directory
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Install pino-pretty globally
RUN npm install -g pino-pretty

# Copy the application source code into the working directory
COPY . .

# Expose the application port
EXPOSE 8080

# Run the deploy-commands script and then start the application using pino-pretty
CMD [ "/bin/sh", "-c", "node deploy-commands && node app.js | pino-pretty" ]
