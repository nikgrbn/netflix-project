FROM gcc:latest

# Install required tools and libraries
RUN apt-get update && apt-get install -y \
    cmake \
    libgtest-dev \
    python3 \
    build-essential \
    && apt-get clean

# Compile and install GTest
RUN cd /usr/src/gtest && \
    cmake CMakeLists.txt && \
    make && \
    cp lib/*.a /usr/lib

# Copy project files
COPY . /usr/src/netflix-project
WORKDIR /usr/src/netflix-project

# Remove any pre-existing cache
RUN rm -rf build CMakeCache.txt

# Build project using CMake
RUN cmake -Bbuild -H. && cmake --build build

CMD ["./build/NetflixProject"]
