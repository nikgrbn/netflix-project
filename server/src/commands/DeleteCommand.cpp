#include "commands/DeleteCommand.h"

string DeleteCommand::execute(const vector<string>& commands) {
    if (commands.size() <= 2) { // Check if at least 3 arguments are provided
        throw StatusCodeException(StatusCodes::BAD_REQUEST);
    }

    // Get our user data
    std::optional<User> mUserOpt = dataManager->get(UID(commands[1]));
    if (!mUserOpt) {
        throw StatusCodeException(StatusCodes::NOT_FOUND);
    }

    vector<Movie> movies;
    for (auto it = commands.begin() + 2; it != commands.end(); ++it) {
        // Create movie object
        Movie movie((UID(*it)));

        // Check if movie already in user's watched
        if (find(movies.begin(), movies.end(), movie) == movies.end()) {
            // If not -> add it
            movies.emplace_back(movie);
        }
    }

    User user(UID(commands[1]), movies);
    dataManager->set(user);

    return "TODO: Implement DeleteCommand";
}

string DeleteCommand::info() const {
    return "DELETE, arguments: [userid] [movieid1] [movieid2] …";
}