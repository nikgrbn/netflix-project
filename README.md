# Netflix Project

## Overview
A command-line movie recommendation system that allows users to add their movie-watching history and receive personalized movie recommendations based on user similarity algorithms.

![](https://github.com/nikgrbn/netflix-project/blob/feature/NP-5-README/preview.png) 

## Features
- Add movies to user watch history
- Get movie recommendations based on viewing patterns
- Persistent data storage
- Command-line interface with simple commands:
  - `add [userid] [movieid1] [movieid2] ...`: Record movies watched by a user
  - `recommend [userid] [movieid]`: Get movie recommendations
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

### Run the Application
```bash
docker-compose run app
```

### Run Unit Tests
```bash
docker-compose run tests
```

## Project Structure
- `src/`: Source code
- `data/`: Data persistence directory
- `tests/`: Unit tests using Google Test framework

## Key Technologies
- C++17
- Google Test
- Docker
- Design Patterns: Command Pattern, Dependency Injection
- SOLID Principles

## Development Approach
- Test-Driven Development (TDD)
- Modular and extensible architecture
- Continuous integration with feature branches
