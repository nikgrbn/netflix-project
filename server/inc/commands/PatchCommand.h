#ifndef PATCH_COMMAND_H
#define PATCH_COMMAND_H

#include "ICommand.h"
#include "IDataManager.h"

class PatchCommand : public ICommand {
private:
    IDataManager *dataManager;
public:
    PatchCommand(IDataManager *dataManager);

    string info() const override;
    string execute(const vector<string>& commands) override;
};

#endif
