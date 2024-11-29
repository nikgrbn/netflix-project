//
// Created by nikita on 11/26/24.
//

#include "../inc/RecommendCommand.h"


string RecommendCommand::execute(vector<string> commands) {
    if (commands.size() != 3) { // Only 3 arguments must be provided
        throw invalid_argument("Invalid number of arguments");
    }

    string mUserID = commands[1];
    string mMovieID = commands[2];

    // Get our user
    User mUser = dataManager->get(mUserID);
    // Load all users from data
    vector<User> users = dataManager->load();

    map<string, int> movieRelevance;

    // For each user in vector
    for_each(users.begin(), users.end(), [&](User& user) {

        // Get users' watched movies
        vector<Movie> userMovies = user.getMoviesWatched();

        // If user is not the same as the one we are looking for and user has watched the movie
        if (user.getId() != mUserID
            && find_if(userMovies.begin(), userMovies.end(), [&](Movie &movie) {
                return movie.getId() == mMovieID; }) != userMovies.end())
        {
            // Calculate common factor with our user
            int commonFactor = getCommonFactor(mUser, user);

            // For each movie in user's watched movies
            for_each(userMovies.begin(), userMovies.end(), [&](Movie& movie) {
                // Increment relevance by common factor
                movieRelevance[movie.getId()] += commonFactor;
            });
        }
    });


    return "TODO: Implement this method";
}

int RecommendCommand::getCommonFactor(User& user1, User& user2) {
    int count = 0;
    for (Movie userMovie1 : user1.getMoviesWatched()) {
        for (Movie userMovie2 : user2.getMoviesWatched()) {
            if (userMovie1.getId() == userMovie2.getId()) {
                count++;
                break;
            }
        }
    }

    return count;
}

string RecommendCommand::info() {
    return "recommend [userid] [movieid]";
}
