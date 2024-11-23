//
// Created by Nikita on 11/23/2024.
//

#ifndef NETFLIX_PROJECT_LOCALDATAMANAGER_H
#define NETFLIX_PROJECT_LOCALDATAMANAGER_H

#include <iostream>
#include <sstream>
#include <fstream>
#include <algorithm>
#include <filesystem>
#include "IDataManager.h"

using namespace std;

class LocalDataManager : public IDataManager {
private:
    string filePath = "data/users.txt";
public:
    LocalDataManager();
    void save(vector<User>& users);
    void set(User user) override;
    vector<User> load() override;
};


#endif //NETFLIX_PROJECT_LOCALDATAMANAGER_H
