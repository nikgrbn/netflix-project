//
// Created by nikita on 11/26/24.
//

#ifndef RECOMMENDCOMMAND_H
#define RECOMMENDCOMMAND_H

#include <algorithm>
#include <map>
#include <sstream>
#include <unordered_set>
#include <unordered_map>
#include "ICommand.h"
#include "IDataManager.h"
#include "User.h"

class RecommendCommand : public ICommand {
private:
    IDataManager* dataManager;
    static int getCommonFactor(const unordered_set<string>& mUserMovies, const vector<Movie>& userMovies);
public:
    RecommendCommand(IDataManager* dataManager) : dataManager(dataManager) {}
    string info() override;
    string execute(vector<string> commands) override;
};



#endif //RECOMMENDCOMMAND_H
