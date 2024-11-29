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

    // Get our user data
    User mUser = dataManager->get(mUserID);
    unordered_set<string> mUserWatched; // unordered_set for O(1) search complexity
    for (Movie& movie : mUser.getMoviesWatched()) {
        mUserWatched.insert(movie.getId());
    }

    // Load all users from data
    vector<User> users = dataManager->load();

    // Unordered map for movie relevance to reduce complexity
    unordered_map<std::string, int> movieRelevance;

    // For each user in vector
    for_each(users.begin(), users.end(), [&](User& user) {
        // Skip the current user
        if (user.getId() == mUserID) return;

        // Get users' watched movies
        vector<Movie> userMovies = user.getMoviesWatched();

        // Check if user has watched the recommendation movie
        if (find_if(userMovies.begin(), userMovies.end(), [&](Movie &movie) {
                return movie.getId() == mMovieID; }) != userMovies.end())
        {
            // Calculate common factor with our user
            int commonFactor = getCommonFactor(mUserWatched, userMovies);

            // Update movie relevance scores
            for (Movie& movie : userMovies) {
                // Skip the movie if it's the recommendation based movie or already watched by mUser
                if (movie.getId() == mMovieID || mUserWatched.count(movie.getId())) {
                    continue;
                }

                // Increment relevance by the common factor
                movieRelevance[movie.getId()] += commonFactor;
            }
        }
    });

    // Convert map to vector of pairs
    vector<pair<string, int>> movieVector(movieRelevance.begin(), movieRelevance.end());

    // Sort vector by the relevance
    sort(movieVector.begin(), movieVector.end(),
         [](const pair<string, int>& a, const pair<string, int>& b) {
            if (a.second == b.second) { // If relevance is the same, sort by movie id
                return a.first < b.first;
            }
            return a.second > b.second;
    });

    // Create a string with movie ids
    ostringstream result;
    for (int i = 0; i < 10 && i < movieVector.size(); i++) {
        result << movieVector[i].first << " ";
    }

    return result.str();
}

int RecommendCommand::getCommonFactor(unordered_set<string> mUserMovies, vector<Movie> userMovies) {
    int count = 0;

    // Check each movie in users' watched movies against the set
    for (Movie& movie : userMovies) {
        if (mUserMovies.count(movie.getId())) { // Fast O(1) lookup
            count++;
        }
    }

    return count;
}

string RecommendCommand::info() {
    return "recommend [userid] [movieid]";
}
