#ifndef NETFLIX_PROJECT_ADDCOMMAND_H
#define NETFLIX_PROJECT_ADDCOMMAND_H

#include "IDataManager.h"
#include <iostream>
#include <vector>
#include "ICommand.h"

using namespace std;

class AddCommand : public ICommand {
private:
    IDataManager* dataManager;
public:
    explicit AddCommand(IDataManager* dataManager) : dataManager(dataManager) {}
    string info() override;
    string execute(vector<string> commands) override;
};

#endif //NETFLIX_PROJECT_ADDCOMMAND_H
