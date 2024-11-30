//
// Created by Nikita on 11/23/2024.
//

#ifndef NETFLIX_PROJECT_IDATAMANAGER_H
#define NETFLIX_PROJECT_IDATAMANAGER_H

#include <vector>
#include "User.h"

class IDataManager {
public:
    virtual void set(User user) = 0;
    virtual User get(string id) = 0;
    virtual vector<User> load() = 0;
};

#endif //NETFLIX_PROJECT_IDATAMANAGER_H
