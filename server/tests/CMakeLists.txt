cmake_minimum_required(VERSION 3.10)

# Set the project name
project(NetflixProjectTests)

# Locate Google Test
find_package(GTest REQUIRED)

# Test files
set(TEST_SOURCES
        core/MainTests.cpp
        utils/TestUtils.cpp
        commands/AddCommandTest.cpp
        commands/RecommendCommandTest.cpp
        commands/HelpCommandTest.cpp
        commands/PatchCommandTest.cpp
        commands/DeleteCommandTest.cpp
        ../src/commands/AddCommand.cpp
        ../src/data_manager/LocalDataManager.cpp
        ../src/models/User.cpp
        ../src/models/Movie.cpp
        ../src/commands/RecommendCommand.cpp
        ../src/commands/HelpCommand.cpp
        ../src/commands/PatchCommand.cpp
        ../src/commands/DeleteCommand.cpp
        ../inc/utils/Config.h
)

# Add test executable
add_executable(runTests ${TEST_SOURCES})

# Link Google Test libraries
target_link_libraries(runTests PRIVATE GTest::GTest GTest::Main)

# Include project headers
target_include_directories(runTests PRIVATE ../include)

# Set correct output directory for the test executable
set_target_properties(runTests PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/tests)

# Register the test target
add_test(NAME RunAllTests COMMAND ${CMAKE_BINARY_DIR}/tests/runTests)
