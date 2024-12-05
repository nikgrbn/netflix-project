#include "../inc/AddCommand.h"

string AddCommand::execute(const vector<string>& commands) {
    if (commands.size() <= 2) { // Check if at least 3 arguments are provided
        throw invalid_argument("Invalid number of arguments");
    }

    // Parse arguments to User object
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

    return "";
}

string AddCommand::info() const {
    return "add [userid] [movieid1] [movieid2] …";
}