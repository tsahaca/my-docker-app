FROM node:20-alpine

# Install curl
RUN apk add --no-cache curl

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the remaining application files
COPY . .

# Set environment variable dynamically
RUN IP=$(curl -s http://checkip.amazonaws.com) && \
    echo "CORS_ORIGIN=\"$IP\"" > .env

# Expose the backend port
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]

