#ifndef NETFLIXPROJECT_TYPES_H
#define NETFLIXPROJECT_TYPES_H

#include <cstdint>
#include <string>

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

#endif //NETFLIXPROJECT_TYPES_H
