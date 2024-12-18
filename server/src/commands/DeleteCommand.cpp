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

    User user = mUserOpt.value();
    vector<Movie> movies = user.getMoviesWatched();
    // Use unordered set to squish duplicates
    unordered_set<std::string> deleteArguments(commands.begin() + 2, commands.end());
    for (const auto& arg : deleteArguments) {

        // Check if movie in user's watched
        auto movieToDelete =
            find(movies.begin(), movies.end(), Movie((UID(arg))));

        // If not in user's watched, throw error
        if (movieToDelete == movies.end()) {
            throw StatusCodeException(StatusCodes::NOT_FOUND);
        }

        // Remove movie from user's watched
        movies.erase(movieToDelete);
    }

    user.setMoviesWatched(movies);
    dataManager->set(user);

    return StatusCodes::NO_CONTENT;
}

string DeleteCommand::info() const {
    return "DELETE, arguments: [userid] [movieid1] [movieid2] …";
}