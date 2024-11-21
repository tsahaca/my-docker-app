# Use the official Node.js image as the base image
FROM node:20-alpine
# Set the working directory in the container
WORKDIR /app
# Copy the application files into the container
COPY . .
# Install dependencies
RUN npm install

# Expose the app port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
