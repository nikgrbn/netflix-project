//
// Created by nikita on 11/26/24.
//

#ifndef RECOMMENDCOMMAND_H
#define RECOMMENDCOMMAND_H

#include <algorithm>
#include <map>
#include <sstream>
#include "ICommand.h"
#include "IDataManager.h"
#include "User.h"

class RecommendCommand : public ICommand {
private:
    IDataManager* dataManager;
    static int getCommonFactor(User& user1, User& user2) ;
public:
    RecommendCommand(IDataManager* dataManager) : dataManager(dataManager) {}
    string info() override;
    string execute(vector<string> commands) override;
};



#endif //RECOMMENDCOMMAND_H
