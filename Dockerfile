# Stage 1: Build the React Application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output from the builder stage to Nginx's html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (required by Cloud Run)
EXPOSE 80

# Cloud Run sets the PORT environment variable to 8080 by default, 
# so we need to configure Nginx to listen on the correct port.
# We replace the default listen port 80 with $PORT in the default.conf
CMD sed -i -e 's/80/8080/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
