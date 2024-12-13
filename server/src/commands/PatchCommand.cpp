#include "commands/PatchCommand.h"
#include "utils/StatusCodeException.h"
#include "models/Movie.h"

PatchCommand::PatchCommand(IDataManager *dataManager) : dataManager(dataManager) {
    
}

string PatchCommand::info() const {
    return "PATCH, arguments: [userid] [movieid1] [movieid2] ...";
}

string PatchCommand::execute(const vector<string>& commands) {
    if (commands.size() < 3) {
        throw StatusCodeException(StatusCodes::BAD_REQUEST);
    }
    
    // Check that a user with that id exists.
    UID userid = UID(commands[1]);

    std::optional<User> userOpt = dataManager->get(userid);
    if (!userOpt.has_value()) {
        throw StatusCodeException(StatusCodes::NOT_FOUND);
    }

    User user = userOpt.value();

    // Add the movies to the user.
    for (size_t i = 2; i < commands.size(); i++) {
        Movie movie = Movie(UID(commands[i]));
        if (!user.hasWatchedMovie(movie)) {
            user.addMovie(movie);
        }
    }

    dataManager->update(user);

    return StatusCodes::NO_CONTENT;
}
