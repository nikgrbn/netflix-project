#ifndef NETFLIX_PROJECT_TYPES_H
#define NETFLIX_PROJECT_TYPES_H

#include <cstdint>
#include <string>
#include <netinet/in.h>
#include "StatusCodeException.h"

namespace StatusCodes {
    constexpr const char* OK = "200 Ok";
    constexpr const char* CREATED = "201 Created";
    constexpr const char* NO_CONTENT = "204 No Content";
    constexpr const char* BAD_REQUEST = "400 Bad Request";
    constexpr const char* NOT_FOUND = "404 Not Found";
}

/**
 * @brief A unique identifier for User and Movie objects.
 * Allows flexibility for future changes.
 */
struct UID {
    std::string value; // ID value is a 64-bit unsigned integer

    explicit UID(unsigned long v) : value(std::to_string(v)) {}
    explicit UID(const std::string& str) : value(str) {}

    std::string toString() const {
        return value;
    }

    bool operator==(const UID& id) const { return value == id.value; }
    bool operator<(const UID& id) const { return value < id.value; }
};

struct SocketData {
    int client_socket;
    char buffer[4096];
    struct sockaddr_in from;
    unsigned int from_len = sizeof(from);
};

#endif //NETFLIX_PROJECT_TYPES_H
