#ifndef NETFLIX_PROJECT_IDATAMANAGER_H
#define NETFLIX_PROJECT_IDATAMANAGER_H

#include <vector>
#include <optional>
#include "models/User.h"

class IDataManager {
public:
    virtual void set(User user) = 0;

    /**
     * @param id The ID of the user to get.
     * @returns The user with the given ID, or an empty optional if no user exists with the given ID.
     */
    virtual std::optional<User> get(const UID& id) = 0;
    virtual vector<User> load() = 0;

    virtual ~IDataManager() = default;
};

#endif //NETFLIX_PROJECT_IDATAMANAGER_H
