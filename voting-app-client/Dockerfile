# Use the official Node.js image as the base image
FROM node:20-alpine

# Install curl
RUN apk add --no-cache curl

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the container
COPY . .

# Install dependencies
RUN npm install

# Retrieve the instance IP and overwrite the .env file
RUN IP=$(curl -s curl ifconfig.me) && \
    echo "REACT_APP_BACKEND_API_URL=$IP" > .env

# Expose the app port
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]
