FROM node:22

# Set the working directory
WORKDIR /usr/src/netflix-project/web-server

# Copy necessary files explicitly from the root context
COPY nodejs-server /usr/src/netflix-project/web-server/nodejs-server
COPY react-client /usr/src/netflix-project/web-server/react-client
COPY config /usr/src/netflix-project/web-server/nodejs-server/config

# Install backend dependencies
WORKDIR /usr/src/netflix-project/web-server/nodejs-server
RUN npm install

# Install React dependencies
WORKDIR /usr/src/netflix-project/web-server/react-client
RUN npm install

# Set production environment before running build
ENV NODE_ENV=production

# Build React client using the updated script
RUN node ../nodejs-server/build-react.js

# Set working directory back to the backend
WORKDIR /usr/src/netflix-project/web-server/nodejs-server

# Expose the port
EXPOSE 19844

# Run the backend server
CMD ["npm", "start"]
