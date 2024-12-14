FROM gcc:latest

# Install required tools and libraries for the application (no gtest)
RUN apt-get update && apt-get install -y cmake

# Copy project files
COPY .. /usr/src/netflix-project
WORKDIR /usr/src/netflix-project

# Clean up unnecessary files
RUN rm -rf build CMakeCache.txt CMakeFiles cmake_install.cmake Makefile

# Create build directory
RUN mkdir build
WORKDIR /usr/src/netflix-project/build

# Build project using CMake (no tests enabled)
RUN cmake -DENABLE_TESTS=OFF .. && make

# Set entrypoint to the built project
ENTRYPOINT ["./NetflixProject"]
