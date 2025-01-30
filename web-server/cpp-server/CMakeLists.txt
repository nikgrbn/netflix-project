cmake_minimum_required(VERSION 3.10)

# Set the project name
project(NetflixProject)

# Enable testing support conditionally
option(ENABLE_TESTS "Enable tests" OFF)

# Specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

SET(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -pthread")

# Add the include directory
include_directories(inc)

# Add the executable
add_executable(NetflixProject
        src/main.cpp
        src/menu/ConsoleMenu.cpp
        src/models/Movie.cpp
        src/models/User.cpp
        src/data_manager/LocalDataManager.cpp
        src/commands/AddCommand.cpp
        src/commands/RecommendCommand.cpp
        src/commands/HelpCommand.cpp
        src/commands/PatchCommand.cpp
        src/commands/DeleteCommand.cpp
        inc/utils/Types.h
        src/core/Server.cpp
        src/menu/SocketMenu.cpp
        inc/menu/SocketMenu.h
        inc/utils/SocketRAII.h
        inc/utils/StatusCodeException.h
        inc/utils/Config.h
        src/utils/ThreadPool.cpp
        inc/utils/ThreadPool.h
)

# Conditionally include tests if ENABLE_TESTS is ON
if(ENABLE_TESTS)
    add_subdirectory(tests)
endif()
