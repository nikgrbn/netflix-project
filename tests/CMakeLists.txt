cmake_minimum_required(VERSION 3.10)

# Set the project name
project(NetflixProjectTests)

# Locate Google Test
find_package(GTest REQUIRED)

# Test files
set(TEST_SOURCES
        MainTests.cpp
        TestUtils.cpp
        AddCommandTest.cpp
        RecommendCommandTest.cpp
        ../src/AddCommand.cpp
        ../src/LocalDataManager.cpp
        ../src/User.cpp
        ../src/Movie.cpp
        ../src/RecommendCommand.cpp
)

# Add test executable
add_executable(runTests ${TEST_SOURCES})

# Link Google Test libraries
target_link_libraries(runTests PRIVATE GTest::GTest GTest::Main)

# Include project headers
target_include_directories(runTests PRIVATE ../include)

# Register the test target
add_test(NAME RunAllTests COMMAND runTests)
