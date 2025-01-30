# Base Python image
FROM python:3.10-slim

# Set working directory in the container
WORKDIR /usr/src/netflix-client/web-server/cpp-server/python-client

# Copy the client script
COPY client.py .

# Default to running client.py
ENTRYPOINT ["python", "client.py"]