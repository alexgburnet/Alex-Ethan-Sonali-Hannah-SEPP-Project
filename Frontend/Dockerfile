# Use node official image with debian instead of alpine for better ARM compatibility
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with specific platform flags for ARM64
RUN npm ci

# Copy rest of the application
COPY . .

# Build the app for production
RUN npm run build

# Install a static file server to serve the built application
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist"]