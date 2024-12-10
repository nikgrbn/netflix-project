//
// Created by nikita on 12/10/24.
//

#ifndef DELETECOMMAND_H
#define DELETECOMMAND_H
#include <data_manager/IDataManager.h>
#include "ICommand.h"
#include "utils/StatusCodeException.h"


class DeleteCommand : public ICommand {
private:
    IDataManager* dataManager;
public:
    explicit DeleteCommand(IDataManager* dataManager) : dataManager(dataManager) {}
    string info() const override;
    string execute(const vector<string>& commands) override;
};




#endif //DELETECOMMAND_H
