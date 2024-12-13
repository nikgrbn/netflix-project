#include "commands/PatchCommand.h"

PatchCommand::PatchCommand(IDataManager *dataManager) : dataManager(dataManager) {
    
}

string PatchCommand::info() const {
    return "PATCH [userid] [movieid1] [movieid2] ...";
}

string PatchCommand::execute(const vector<string>& commands) {
    return "";
}
