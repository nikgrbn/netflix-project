cmake_minimum_required(VERSION 3.10)

# Set the project name
project(NetflixProject)

# Enable testing support
enable_testing()

# Specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add the include directory
include_directories(inc)
add_subdirectory(tests)

# Add the executable
add_executable(NetflixProject
        src/main.cpp
        src/App.cpp
        src/ConsoleMenu.cpp
        src/Movie.cpp
        src/User.cpp
        src/LocalDataManager.cpp
        src/AddCommand.cpp
        src/RecommendCommand.cpp
        src/HelpCommand.cpp
        inc/Types.h
)

# Link libraries if needed (none specified in the provided context)