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
- Add movies to user watch history
- Get movie recommendations based on viewing patterns
- Persistent data storage
- Command-line interface with simple commands:
  - `POST [userid] [movieid1] [movieid2] ...`: Record movies watched by a user
  - `PATCH [userid] [movieid1] [movieid2] ...`: Updates the user's watch history by adding new movies only if they don't already exist in the history.
  - `DELETE [userid] [movieid1] [movieid2] ...`: Remove a specific movie from the user's watch       history
  - `GET [userid] [movieid]`: Get movie recommendations
  - `help`: Display available commands

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
- `client/`: Client-side logic and scripts 
- `server/`: Server-side application code
  - `inc/`: Header files for commands, core logic, and utilities
  - `src/`: Source code implementation for commands, core components, and utilities
  - `tests/`: Unit tests using the Google Test framework


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

