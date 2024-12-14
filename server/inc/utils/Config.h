#ifndef NETFLIX_PROJECT_CONFIG_H
#define NETFLIX_PROJECT_CONFIG_H

#include <string>

/**
 * This class contains the configuration of the server
 */
class Config {
public:
    static std::string getUserFilePath() {
        return "data/users.txt"; // Centralized path
    }
    static std::string getDataFolderPath() {
        return "data"; // Centralized folder
    }
};

#endif //NETFLIX_PROJECT_CONFIG_H
