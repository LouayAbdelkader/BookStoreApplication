# Use the official Python image as a base
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the application code
COPY . /app

# Install required Python dependencies
RUN pip install --no-cache-dir Flask==2.2.5 Flask-Cors==3.0.10 pymongo==4.4.1

# Expose the port the app runs on
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
