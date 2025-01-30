#ifndef PATCH_COMMAND_H
#define PATCH_COMMAND_H

#include "commands/ICommand.h"
#include "data_manager/IDataManager.h"
#include "utils/StatusCodeException.h"
#include "models/Movie.h"

class PatchCommand : public ICommand {
private:
    IDataManager *dataManager;
public:
    PatchCommand(IDataManager *dataManager);

    string info() const override;
    string execute(const vector<string>& commands) override;
};

#endif
