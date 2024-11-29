
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    wget \
    unzip

COPY . /usr/src/NetflixProject

WORKDIR /usr/src/NetflixProject

RUN mkdir build
WORKDIR /usr/src/NetflixProject/build

RUN cmake .. && make

CMD ["./runTests"]