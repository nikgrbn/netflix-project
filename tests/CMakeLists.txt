# Locate Google Test
find_package(GTest REQUIRED)

include(FetchContent)
FetchContent_Declare(
        googletest
        URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

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
