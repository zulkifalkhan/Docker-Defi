# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["node", "app.js"]
