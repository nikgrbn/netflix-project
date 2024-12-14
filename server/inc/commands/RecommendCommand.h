#ifndef NETFLIX_PROJECT_RECOMMENDCOMMAND_H
#define NETFLIX_PROJECT_RECOMMENDCOMMAND_H

#include <algorithm>
#include <map>
#include <sstream>
#include <unordered_set>
#include <unordered_map>
#include "ICommand.h"
#include "data_manager/IDataManager.h"
#include "models/User.h"
#include "utils/StatusCodeException.h"

class RecommendCommand : public ICommand {
private:
    IDataManager* dataManager;
    static int getCommonFactor(const unordered_set<string>& mUserMovies, const vector<Movie>& userMovies);
public:
    explicit RecommendCommand(IDataManager* dataManager) : dataManager(dataManager) {}
    string info() const override;
    string execute(const vector<string>& commands) override;
};

#endif //RECOMMENDCOMMAND_H
