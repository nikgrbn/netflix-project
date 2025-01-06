# Netflix Project

## Overview
This project provides a multi-functional movie management system comprising two main servers: a **C++ Server** for command-line-based movie recommendations and a **Web Server** built with Node.js, following the **MVC architecture**. 
The web server communicates with MongoDB for persistent data storage and integrates with the C++ server for additional functionality, such as updating user watch history.

## Execution Examples

### C++ Server Startup
<img src="assets/cserver.png" alt="C++ Server Startup" width="400"/>

### Web Server Startup
<img src="assets/webserver.png" alt="Web Server Startup" width="400"/>

### Categories Endpoint Response
<img src="assets/catories.png" alt="Categories Response" width="400"/>

## Features
### **C++ Server Features**
The C++ server enables users to manage their movie-watching history through a command-line interface and includes the following functionality:

- **Add Movies to User Watch History**  
  Allows users to add movies they've watched to their personal watch history.

- **Get Movie Recommendations Based on Viewing Patterns**  
  Provides movie suggestions based on the user's viewing history.

- **Persistent Data Storage**  
  User data and movie watch history are stored persistently.

- **ThreadPool Implementation:** Ensures efficient multi-threaded processing of user requests.

- **Command-Line Interface (CLI)**  
  A simple CLI for managing user watch history and recommendations:
  - **`POST [userid] [movieid1] [movieid2] ...`**: Record movies watched by a user. Creates a new watch history if it doesn't exist.
  - **`PATCH [userid] [movieid1] [movieid2] ...`**: Update the user's watch history by adding only new movies (avoids duplicates).
  - **`DELETE [userid] [movieid1] [movieid2] ...`**: Remove specific movies from the user's watch history.
  - **`GET [userid] [movieid]`**: Retrieve movie recommendations for the user.
  - **`help`**: Display available CLI commands and their usage.

---

### **Web Server Features**
The web server provides RESTful APIs for user management, movie operations, and recommendations, and follows the **MVC pattern** to ensure loose coupling and adherence to **SOLID principles**.

#### **User Management**
- **Create a New User:** Register a user with `POST /api/users`.
- **Get User Details:** Retrieve user information with `GET /api/users/:id`.
- **User Authentication:** Validate credentials and generate tokens using `POST /api/tokens`.

#### **Movie Management**
- **Get Movies by Categories**: Retrieve movies grouped by categories using `GET /api/movies`.  
  - Recommended categories: up to 20 unwatched movies in random order.  
  - Non-recommended categories: up to 20 random movies.  
  - Includes the user's last 20 viewed movies as a separate category.
- **Add a New Movie:** Add a movie with `POST /api/movies`.
- **Get Movie Details:** Retrieve a movie’s details with `GET /api/movies/:id`.
- **Update Movie:** Update an existing movie with `PUT /api/movies/:id`.
- **Delete Movie:** Remove a movie using `DELETE /api/movies/:id`.
- **Search Movies:** Search movies with keywords using `GET /api/movies/search/:query`.


#### **Category Management**
- **Get All Categories:** Retrieve all categories with `GET /api/categories`.
- **Create a New Category:** Add a category with `POST /api/categories`.
- **Get Category Details:** Retrieve details of a specific category with `GET /api/categories/:id`.
- **Update Category:** Update category details with `PATCH /api/categories/:id`.
- **Delete Category:** Remove a category using `DELETE /api/categories/:id`.

#### **Recommendations**
- **Retrieve Movie Recommendations:** Fetch personalized recommendations from the C++ server with `GET /api/movies/:id/recommend`.
- **Add Recommendation:** Add a movie recommendation with `POST /api/movies/:id/recommend`.

### **Integration**
- The web server communicates with the C++ server for adding movies to user watch history. This integration ensures seamless interaction between the two systems.


---

### **Data Handling and Behavior**
- The web server uses **MongoDB** for persistent data storage.
- All API responses are returned in **JSON format**.
- Appropriate HTTP status codes are used for success and error scenarios (e.g., `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).

---

## Prerequisites
- **Docker**
- **Node.js** and **MongoDB**


## Installation and running

### 1. Clone Repository
```bash
git clone https://github.com/nikgrbn/netflix-project.git
cd netflix-project
```

### 2. Build Docker Image
```bash
docker-compose build
```

### 3. Start Movie Recommendation System
```bash
docker-compose run --rm --name c-server c-server 19845
```

### 4. Configure Environment
Create a configuration file `.env.production` in the `/web/config/` directory. We recommend to use this configuration:
```plaintext
MONGO_URI="mongodb://mongo:27017/netflix-db"
PORT=19844
MRS_IP="c-server"
MRS_PORT=19845
```

### 5. Launch Web Server
```bash
docker-compose -f docker-compose.yml run --rm --name web-server --service-ports web-server
```

### 6. Verify Setup
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

The system is designed with a modular architecture to ensure scalability, maintainability, and extensibility. Key components include:

1. **C++ Server**
   - Responsible for managing user interactions and watch history via a command-line interface.
   - Communicates with the Web server to fetch movie recommendations.
   - Processes and stores user watch history persistently.
   - Handles requests from the Web server to add movies to a user's watch history.

2. **Web Server**
   - Built using Node.js and Express, connected to a MongoDB database.
   - Handles RESTful API requests for user management, movie operations, and recommendations.
   - Sends requests to the C++ server to update user watch history when movies are added.
   - Implements modular design with the following layers:
     - **Routes**: Define HTTP endpoints and map them to controllers.
     - **Controllers**: Handle business logic for requests and responses.
     - **Services**: Encapsulate reusable logic, such as database operations and communication with the C++ server.
     - **Models**: Define MongoDB schemas and data structures.

3. **Database**
   - MongoDB is used for persistent data storage.
   - Stores user details, movie data, categories, and recommendations.
   - Optimized for querying and scalability.

#### **Extensibility**
- **Adding New Features**:  
  The modular design allows for easy integration of additional routes, services, or models without impacting existing functionality.
  
- **Support for New Clients**:  
  The architecture supports integration with additional clients (e.g., mobile apps) via RESTful APIs.

- **Scalability**:  
  Both servers can be scaled horizontally to handle increased load, with MongoDB ensuring efficient data handling.

## Separation of Assignments

To ensure proper evaluation of Assignment 2, the code for Assignment 2 is maintained in a dedicated branch, independent of the code for Assignment 3. This allows the evaluator to test Assignment 2 without any interference from changes or additions related to Assignment 3.

### Branch Organization
- **Assignment 2 Branch:**  
  The code for Assignment 2 is stored in a separate branch (e.g., `part-2`). This branch contains all the necessary functionality and files required for Assignment 2, without any dependencies or overlaps with Assignment 3.

- **Assignment 3 Branch:**  
  The work for Assignment 3 is stored in its own branch (e.g., `part-3`). This ensures that the code for Assignment 3 does not affect the evaluation of Assignment 2.


 ## Additional Notes
- **`main.cpp`:**  
  Serves as the entry point for the C++ server, orchestrating server-side logic and execution. It initializes the necessary components and manages the main server loop.

- **Helper Utilities (`Config` and `Types`):**  
  These utilities provide modular and reusable components for managing configuration files and maintaining type consistency across the system. They ensure clean, readable, and maintainable code.

- **Command Implementation Using Interfaces:**  
  All commands in the system are implemented following the **interface-based design pattern**, which adheres to the **Open/Closed Principle** from SOLID principles. This design allows for the easy addition of new commands without modifying existing code, enhancing the system's extensibility and maintainability.

- **Loose Coupling Across Components:**  
  The project emphasizes **loose coupling** between modules, enabling independent development, testing, and scalability for both the C++ server and the web server.

- **ThreadPool Usage in C++ Server:**  
  The C++ server employs a **ThreadPool** to efficiently handle multiple client requests concurrently, ensuring high performance and responsiveness under heavy workloads.

- **Integration Between Web and C++ Servers:**  
  The web server communicates seamlessly with the C++ server for updating user watch history and fetching recommendations, leveraging RESTful APIs and a modular service-oriented architecture.
