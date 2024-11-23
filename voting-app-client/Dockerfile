FROM node:20-alpine

# Install curl
RUN apk add --no-cache curl

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the container
COPY . .
COPY .env .
# Install dependencies
RUN npm install

# Expose the app port
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]

