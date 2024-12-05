#ifndef NETFLIX_PROJECT_TYPES_H
#define NETFLIX_PROJECT_TYPES_H

#include <cstdint>
#include <string>
#include <netinet/in.h>

/**
 * @brief A unique identifier for User and Movie objects.
 * Allows flexibility for future changes.
 */
struct UID {
    unsigned long value; // ID value is a 64-bit unsigned integer

    explicit UID(unsigned long v) : value(v) {}
    explicit UID(const std::string& str) : value(std::stoul(str)) {}

    std::string toString() const {
        return std::to_string(value);
    }

    bool operator==(const UID& id) const { return value == id.value; }
    bool operator<(const UID& id) const { return value < id.value; }
};

struct SocketData {
    int client_socket;
    char buffer[4096];
    struct sockaddr_in from;
};

#endif //NETFLIX_PROJECT_TYPES_H
