# Napflix 🎬

<table>
  <tr>
    <th>Website</th>
    <th>Android App</th>
  </tr>
  <tr>
    <td>
      <img src="wiki/readme-preview/website-preview.gif" alt="Website" width="400"/>
    </td>
    <td>
      <img src="wiki/readme-preview/android-app-preview.png" alt="Android App" height="300"/>
    </td>
  </tr>
</table>

## Overview
**Napflix** is a movie streaming platform developed within *Advanced Programming* course in *Bar-Ilan university*. Platform features user authentication, personalized movie recommendations, and category-based browsing, powered by a C++ Recommendation System, Node.js backend and React frontend.

Data stored in MongoDB/Room. Docker used for containerized deployment.


## Tech Stack
[![](https://skillicons.dev/icons?i=react,androidstudio,nodejs,cpp,java)]()


## Installation
#### Prerequisites

- **Docker**
- **Node.js** and **MongoDB**

#### 1. Clone the repository

```bash
git clone https://github.com/nikgrbn/netflix-project.git
cd netflix-project/web-server
```

#### 2. Configure Environment

Create a configuration file `.env.production` in the `/web-server/config/` directory. We recommend to use this configuration:

```plaintext
MONGO_URI="mongodb://mongo:27017/netflix-db"
PORT=19844
MRS_IP="cpp-server"
MRS_PORT=19845
JWT_SECRET_KEY="my-super-secret-key"
```

#### 3. Build the Docker image

```bash
docker-compose build
```

#### 4. Start Movie Recommendation System

Run c++ Server with Custom Port

```bash
docker-compose run --rm --name cpp-server cpp-server 19845
```

#### 5. Launch Web Server

```bash
docker-compose -f docker-compose.yml run --rm --name nodejs-server --service-ports nodejs-server
```

#### 6. Test

#### Run Tests on C++ server

```bash
docker-compose run --rm cpp-tests
```

#### Run Python Client to C++ server

```bash
docker-compose run --rm python-client cpp-server 19845
```
