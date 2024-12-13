# Base Python image
FROM python:3.10-slim

# Set working directory in the container
WORKDIR /usr/src/netflix-client

# Copy the client script
COPY client.py .

# Install required Python dependencies (add your dependencies here)
# Example:
# COPY requirements.txt .
# RUN pip install -r requirements.txt

# Default command to run the client
CMD ["python", "client.py"]
