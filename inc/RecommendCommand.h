//
// Created by nikita on 11/26/24.
//

#ifndef RECOMMENDCOMMAND_H
#define RECOMMENDCOMMAND_H

#include "ICommand.h"
#include "IDataManager.h"

class RecommendCommand : public ICommand {
private:
    IDataManager* dataManager;
public:
    RecommendCommand(IDataManager* dataManager) : dataManager(dataManager) {}
    string info() override;
    string execute(vector<string> commands) override;
};



#endif //RECOMMENDCOMMAND_H
