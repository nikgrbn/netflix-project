#ifndef NETFLIX_PROJECT_IDATAMANAGER_H
#define NETFLIX_PROJECT_IDATAMANAGER_H

#include <vector>
#include "User.h"

class IDataManager {
public:
    virtual void set(User user) = 0;
    virtual User get(const UID& id) = 0;
    virtual vector<User> load() = 0;
};

#endif //NETFLIX_PROJECT_IDATAMANAGER_H
