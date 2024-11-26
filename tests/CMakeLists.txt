# Locate Google Test
find_package(GTest REQUIRED)

# Test files
set(TEST_SOURCES
        MainTests.cpp
        AddCommandTest.cpp
        RecommendCommandTest.cpp
        TestVars.h
        ../src/AddCommand.cpp
        ../src/LocalDataManager.cpp
        ../src/User.cpp
        ../src/Movie.cpp
)

# Add test executable
add_executable(runTests ${TEST_SOURCES})

# Link Google Test libraries
target_link_libraries(runTests PRIVATE GTest::GTest GTest::Main)

# Include project headers
target_include_directories(runTests PRIVATE ../include)

# Register the test target
add_test(NAME RunAllTests COMMAND runTests)
