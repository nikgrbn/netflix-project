cmake_minimum_required(VERSION 3.10)

# Set the project name
project(NetflixProject)

# Enable testing support conditionally
option(ENABLE_TESTS "Enable tests" OFF)

# Specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add the include directory
include_directories(inc)

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
        inc/Types.h
)

# Conditionally include tests if ENABLE_TESTS is ON
if(ENABLE_TESTS)
    add_subdirectory(tests)
endif()
