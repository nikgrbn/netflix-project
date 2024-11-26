//
// Created by nikita on 11/24/24.
//

#include "../inc/AddCommand.h"

string AddCommand::execute(vector<string> commands) {
    if (commands.size() <= 2) { // Check if at least 3 arguments are provided
        throw invalid_argument("Invalid number of arguments");
    }

    // Parse arguments to User object
    vector<Movie> movies;
    for (auto it = commands.begin() + 2; it != commands.end(); ++it) {
        // Check if movie already in user's watched
        if (find(movies.begin(), movies.end(),
            *it) == movies.end()) {
            // If not -> add it
            movies.emplace_back(*it);
            }
    }

    User user(commands[1], movies);
    dataManager->set(user);

    return "";
}

string AddCommand::info() {
    return "add [userid] [movieid1] [movieid2] …";
}