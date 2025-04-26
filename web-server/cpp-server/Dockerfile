FROM gcc:latest

# Install required tools and libraries for testing
RUN apt-get update && apt-get install -y \
    cmake \
    libgtest-dev \
    ninja-build

# Compile and install Google Test manually
WORKDIR /usr/src/gtest
RUN cmake -G Ninja && ninja && cp lib/*.a /usr/lib/

# Set project directory
WORKDIR /usr/src/netflix-project/web-server/cpp-server

# Copy project files
COPY cpp-server/ /usr/src/netflix-project/web-server/cpp-server/

# Clean up unnecessary files
RUN rm -rf build CMakeCache.txt CMakeFiles cmake_install.cmake Makefile

# Create and move into the build directory
RUN mkdir -p /usr/src/netflix-project/web-server/cpp-server/build
WORKDIR /usr/src/netflix-project/web-server/cpp-server/build

# Build project with tests enabled
RUN cmake .. && make -j4

# Set entrypoint to the built project
ENTRYPOINT ["/usr/src/netflix-project/web-server/cpp-server/build/NetflixProject"]
