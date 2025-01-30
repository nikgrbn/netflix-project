# Netflix Project

## Overview

This project provides a multi-functional movie management system comprising two main servers: a **C++ Server** for command-line-based movie recommendations and a **Web Server** built with Node.js, following the **MVC architecture**.
The web server communicates with MongoDB for persistent data storage and integrates with the C++ server for additional functionality, such as updating user watch history.

<table>
  <tr>
    <th>C++ Server</th>
    <th>Web Server</th>
    <th>HTTP Request</th>
  </tr>
  <tr>
    <td>
      <img src="assets/cserver.png" alt="C++ Server" width="400"/>
    </td>
    <td>
      <img src="assets/webserver.png" alt="Web Server" width="400"/>
    </td>
    <td>
      <img src="assets/http-request.png" alt="HTTP Request" width="400"/>
    </td>
  </tr>
</table>

## Prerequisites

- **Docker**
- **Node.js** and **MongoDB**

## Installation

To run front and backend on the same server, go to `/web-server/nodejs-server` and run  `npm run build-react`, then run `npm start`.

### 1. Clone the repository

```bash
git clone https://github.com/nikgrbn/netflix-project.git
cd netflix-project/web-server
```

### 2. Configure Environment

Create a configuration file `.env.production` in the `/web-server/config/` directory. We recommend to use this configuration:

```plaintext
MONGO_URI="mongodb://mongo:27017/netflix-db"
PORT=19844
MRS_IP="cpp-server"
MRS_PORT=19845
JWT_SECRET_KEY="my-super-secret-key"
```

### 3. Build the Docker image

```bash
docker-compose build
```

### 4. Start Movie Recommendation System

Run c++ Server with Custom Port

```bash
docker-compose run --rm --name cpp-server cpp-server 19845
```

### 5. Launch Web Server

```bash
docker-compose -f docker-compose.yml run --rm --name nodejs-server --service-ports nodejs-server
```

### 6. Test

#### Run Tests on C++ server

```bash
docker-compose run --rm cpp-tests
```

#### Run Python Client to C++ server

```bash
docker-compose run --rm python-client cpp-server 19845
```