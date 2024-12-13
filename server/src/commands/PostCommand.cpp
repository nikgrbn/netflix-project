#include <optional>

#include "commands/PostCommand.h"
#include "utils/Types.h"
#include "utils/StatusCodeException.h"
#include "models/User.h"

PostCommand::PostCommand(IDataManager *dataManager) : dataManager(dataManager) {
    
}

string PostCommand::info() const{
    return "POST [userid] [movieid1] [movieid2] ...";
}

string PostCommand::execute(const vector<string>& commands) {
    if (commands.size() < 3) {
        throw StatusCodeException(StatusCodes::BAD_REQUEST);
    }

    UID uid = UID(commands[1]);
    std::optional<User> userOpt = dataManager->get(uid);

    if (userOpt.has_value()) {
        std::cout << "\t\t\t\t\t\t\t\t\tHAS VALUE\n" << "\t\t\t\t\t\t\t\t\t" << uid.toString() << std::endl;
        throw StatusCodeException(StatusCodes::BAD_REQUEST);
    }

    User user(uid);
    for (size_t i = 2; i < commands.size(); i++) {
        user.addMovie(Movie(UID(commands[i])));
    }
    
    dataManager->set(user);

    return StatusCodes::CREATED;
}
