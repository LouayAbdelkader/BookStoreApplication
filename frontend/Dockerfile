# Use official Nginx image to serve the frontend
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy the frontend files to the nginx html directory
COPY . .

# Expose port 80 to access the app
EXPOSE 80

# Use the default nginx server to serve the frontend
CMD ["nginx", "-g", "daemon off;"]
