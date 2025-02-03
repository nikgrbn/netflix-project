//
// Created by Nikita on 12/5/2024.
//

#ifndef NETFLIX_PROJECT_SOCKETRAII_H
#define NETFLIX_PROJECT_SOCKETRAII_H

#include <iostream>
#include <unistd.h>

using namespace std;

/**
 * RAII wrapper for socket file descriptor
 * Automatically closes the socket when the object goes out of scope
 */
class SocketRAII {
private:
    int socket_fd;

public:
    explicit SocketRAII(int fd) : socket_fd(fd) {}
    ~SocketRAII() {
        if (socket_fd >= 0) {
            std::cout << socket_fd << ":Closing socket " << std::endl;
            close(socket_fd);
        }
    }

    int get() const { return socket_fd; }
    SocketRAII(const SocketRAII&) = delete; // Non-copyable
    SocketRAII& operator=(const SocketRAII&) = delete; // Non-assignable
};


#endif //NETFLIX_PROJECT_SOCKETRAII_H
