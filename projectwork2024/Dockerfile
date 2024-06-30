# Use the official Python image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy the application files
COPY . .

# Install NGINX
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy the NGINX configuration file
COPY nginx.conf /etc/nginx/sites-available/default

# Expose the port NGINX will run on
EXPOSE 80

# Command to run Gunicorn and NGINX
CMD service nginx start && gunicorn --workers 3 --bind 127.0.0.1:8000 endpoints:app
