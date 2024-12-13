#ifndef NETFLIX_PROJECT_LOCALDATAMANAGER_H
#define NETFLIX_PROJECT_LOCALDATAMANAGER_H

#include <iostream>
#include <sstream>
#include <fstream>
#include <algorithm>
#include <filesystem>
#include <map>
#include <mutex>
#include "data_manager/IDataManager.h"
#include "utils/StatusCodeException.h"

using namespace std;

class LocalDataManager : public IDataManager {
private:
    string filePath = "data/users.txt";
    std::vector<User> users;
    std::mutex mtx;
private:
    void save();
    void loadUsersFromFile(std::string filename);
public:
    LocalDataManager();
    ~LocalDataManager() override;
    void set(User user) override;
    void update(User user) override;
    std::optional<User> get(const UID& id) override;
    vector<User> load() override;
};


#endif //NETFLIX_PROJECT_LOCALDATAMANAGER_H
