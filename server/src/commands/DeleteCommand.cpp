#include "commands/DeleteCommand.h"

string DeleteCommand::execute(const vector<string>& commands) {
    if (commands.size() <= 2) { // Check if at least 3 arguments are provided
        throw StatusCodeException(StatusCodes::BAD_REQUEST);
    }

    // Get our user data
    std::optional<User> mUserOpt = dataManager->get(UID(commands[1]));
    if (!mUserOpt) { // Check if user exists
        throw StatusCodeException(StatusCodes::NOT_FOUND);
    }

    vector<Movie> movies((*mUserOpt).getMoviesWatched());
    for (auto it = commands.begin() + 2; it != commands.end(); ++it) {
        // Check if movie in users watched
        auto movieToDelete =
            find(movies.begin(), movies.end(), Movie((UID(*it))));
        if (movieToDelete == movies.end()) {
            // If not in user's watched, throw error
            throw StatusCodeException(StatusCodes::NOT_FOUND);
        }

        // Remove movie from user's watched
        movies.erase(movieToDelete);
    }

    User user(UID(commands[1]), movies);
    dataManager->set(user);

    return StatusCodes::NO_CONTENT;
}

string DeleteCommand::info() const {
    return "DELETE, arguments: [userid] [movieid1] [movieid2] …";
}