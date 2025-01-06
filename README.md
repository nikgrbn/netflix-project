# Netflix Project

## Overview
A command-line movie recommendation system that allows users to add their movie-watching history and receive personalized movie recommendations based on user similarity algorithms.

<table>
  <tr>
    <th>Client</th>
    <th>Server</th>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/nikgrbn/netflix-project/blob/557f761f426b054e492edf359fc2eed3971d5871/assets/client.png" width="%45"/>
    </td>
    <td>
      <img src="https://github.com/nikgrbn/netflix-project/blob/557f761f426b054e492edf359fc2eed3971d5871/assets/server.png" width="%45"/>
    </td>
  </tr>
</table>

## Features
### **C++ Server Features**
The following features are implemented in the C++ server, which manages user interactions and viewing history through a command-line interface:

- **Add Movies to User Watch History**  
  Allows users to add movies they've watched to their personal watch history.

- **Get Movie Recommendations Based on Viewing Patterns**  
  Provides movie suggestions based on the user's viewing history.

- **Persistent Data Storage**  
  User data and movie watch history are stored persistently.

- **Command-Line Interface (CLI)**  
  A simple CLI for managing user watch history and recommendations:
  - **`POST [userid] [movieid1] [movieid2] ...`**: Record movies watched by a user. Creates a new watch history if it doesn't exist.
  - **`PATCH [userid] [movieid1] [movieid2] ...`**: Update the user's watch history by adding only new movies (avoids duplicates).
  - **`DELETE [userid] [movieid1] [movieid2] ...`**: Remove specific movies from the user's watch history.
  - **`GET [userid] [movieid]`**: Retrieve movie recommendations for the user.
  - **`help`**: Display available CLI commands and their usage.

---

### **Web Server Features**
The following features are implemented in the web server, which connects to a MongoDB database and provides RESTful APIs:

#### **User Management**
- **Create a New User**: Register a new user using `POST /api/users` with user details in the request body.
- **Get User Details**: Retrieve information about a user using `GET /api/users/:id`.
- **User Authentication**: Verify user credentials using `POST /api/tokens` and return a token for valid users.

#### **Movie Management**
- **Get Movies by Categories**: Retrieve movies grouped by categories using `GET /api/movies`.  
  - Recommended categories: up to 20 unwatched movies in random order.  
  - Non-recommended categories: up to 20 random movies.  
  - Includes the user's last 20 viewed movies as a separate category.
- **Add a New Movie**: Add a new movie using `POST /api/movies` with movie details in the request body.
- **Get Movie Details**: Retrieve details of a specific movie using `GET /api/movies/:id`.
- **Update Movie**: Update an existing movie using `PUT /api/movies/:id`.
- **Delete Movie**: Remove a movie using `DELETE /api/movies/:id`.
- **Search Movies**: Search for movies using keywords in `GET /api/movies/search/:query`.


#### **Category Management**
- **Get All Categories**: Retrieve a list of categories using `GET /api/categories`.
- **Create a New Category**: Add a new category using `POST /api/categories`.
- **Get Category Details**: Get details of a specific category using `GET /api/categories/:id`.
- **Update Category**: Update category details using `PATCH /api/categories/:id`.
- **Delete Category**: Remove a category using `DELETE /api/categories/:id`.

#### **Recommendations**
- **Get Movie Recommendations**: Retrieve a list of recommended movies based on user activity using `GET /api/movies/:id/recommend`.
- **Add Recommendation**: Add a new recommendation for a specific movie using `POST /api/movies/:id/recommend`.

---

### **Data Handling and Behavior**
- The web server uses **MongoDB** for persistent data storage.
- All API responses are returned in **JSON format**.
- Appropriate HTTP status codes are used for success and error scenarios (e.g., `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).

---

## Prerequisites
- **Docker**
  
    *Ensure Docker and Docker Compose are installed on your system.*

## Installation

1. Clone the repository
```bash
git clone https://github.com/nikgrbn/netflix-project.git
cd netflix-project
```

2. Build the Docker image
```bash
docker-compose build
```

## Running the Application

### Start Movie Recommendation System
```bash
docker-compose run --rm --name c-server c-server 19845
```
Note: Replace `19845` with your desired port number

### Configure Environment
```bash
Create a configuration file `.env.production` in the `/web/config/` directory. We recommend to use this configuration:
```plaintext
MONGO_URI="mongodb://mongo:27017/netflix-db"
PORT=19844
MRS_IP="c-server"
MRS_PORT=19845
```

### Launch Web Server
```bash
docker-compose -f docker-compose.yml run --rm --name web-server --service-ports web-server
```

### Verify Setup
```bash
curl -i http://localhost:19844/api/categories
```

### Run Tests
```bash
docker-compose run --rm tests
```

## Project Structure
- `client/`: Client-side logic and scripts (c++)
- `server/`: Server-side application code (c++)
  - `inc/`: Header files for commands, core logic, and utilities
  - `src/`: Source code implementation for commands, core components, and utilities
  - `tests/`: Unit tests using the Google Test framework
- `web/`: the core of the web application, structured following the MVC design pattern.
  - `controllers/`: handling HTTP requests, interacting with services, and returning responses.
  - `models/`: including database schemas and interactions, typically using Mongoose for MongoDB.
  - `routes/`: Maps HTTP endpoints to their respective controllers, defining the application's API structure.
  - `services/`: Contains business logic and reusable functions for interacting with models, APIs, or performing complex operations.
  - `utils/`: Provides utility functions and helper scripts used across the application.
- `app/`: The entry point of the application, initializing the server, middleware, routes, and database connection.

## Development Approach
- Test-Driven Development (TDD)
- Modular and extensible architecture
- Continuous integration with feature branches

## Architecture and Extensibility
In our project, renaming and adding new commands did not require modifications to existing code that is designed to be closed for modification but open for extension. This was achieved through the ICommand interface, which allowed us to add or rename commands by implementing them in new files, such as PatchCommand.cpp and PostCommand.cpp, without altering existing functionality.

Additionally, a minor infrastructure adjustment was made by introducing a Mutex in LocalDataManager.cpp to handle concurrent access to the shared IDataManager resource, ensuring thread safety.

Changing the input/output to sockets instead of using the console also did not require changes to the existing code. This was implemented by adding a new file, Server.cpp, which centralizes the server-side communication logic and integrates seamlessly with the project. The client-side logic was implemented separately in client.py, ensuring a clean separation of responsibilities.

Overall, the project's modular architecture allowed us to extend the system efficiently without breaking existing components, keeping the codebase robust and maintainable.

 ## Additional Notes
- The project includes main.cpp for controlling the server-side logic and execution.
- Helper utilities like Config and Types ensure clean and consistent code.
- Commands were implemented using interfaces, allowing easy extension without modifying existing code.

