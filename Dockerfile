FROM gcc:latest

# Install required tools and libraries
RUN apt-get update && apt-get install -y \
    cmake \
    libgtest-dev

# Compile and install GTest
RUN cd /usr/src/gtest && \
    cmake CMakeLists.txt && \
    make && \
    cp lib/*.a /usr/lib

# Copy project files
COPY . /usr/src/netflix-project
WORKDIR /usr/src/netflix-project

# Clean up unnecessary files
RUN rm -rf build CMakeCache.txt CMakeFiles cmake_install.cmake Makefile

# Create build directory
RUN mkdir build
WORKDIR /usr/src/netflix-project/build

# Build project using CMake
ARG BUILD_CONTEXT=app
RUN if [ "$BUILD_CONTEXT" = "app" ]; then \
        cmake .. && make; \
    elif [ "$BUILD_CONTEXT" = "tests" ]; then \
        cmake ../tests && make; \
    fi

CMD ["bash"]
