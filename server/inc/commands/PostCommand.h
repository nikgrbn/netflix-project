#ifndef POST_COMMAND_H
#define POST_COMMAND_H

#include "commands/ICommand.h"
#include "data_manager/IDataManager.h"

class PostCommand : public ICommand {
private:
    IDataManager *dataManager;
public:
    PostCommand(IDataManager *dataManager);

    string info() const override;
    string execute(const vector<string>& commands) override;
};

#endif // POST_COMMAND_H
