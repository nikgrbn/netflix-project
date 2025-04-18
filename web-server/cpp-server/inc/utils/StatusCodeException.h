#ifndef NETFLIX_PROJECT_INVALIDCOMMANDEXCEPTION_H
#define NETFLIX_PROJECT_INVALIDCOMMANDEXCEPTION_H

#include <stdexcept>

class StatusCodeException : public std::runtime_error {
public:
    explicit StatusCodeException(const std::string& message)
            : std::runtime_error(message) {}
};

#endif //NETFLIX_PROJECT_INVALIDCOMMANDEXCEPTION_H
