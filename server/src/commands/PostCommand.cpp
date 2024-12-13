#include "commands/PostCommand.cpp"

PostCommand::PostCommand(IDataManager *dataManager) : dataManager(dataManager) {

}

string PostCommand::info() const{
    return "POST [userid] [movieid1] [movieid2] ...";
}

string PostCommand::execute(const vector<string>& commands) {
    return "";
}
