#include "models/User.h"

bool User::operator==(const User &user) const {
    return this->id == user.id;
}

void User::addMovie(Movie movie) {
    // Check if movie already in user's watched
    if (hasWatchedMovie(movie)) {
        return;
    }
    // If not -> add it
    this->movies_watched.push_back(movie);
}

const vector<Movie> User::getMoviesWatched() const {
    return this->movies_watched;
}

void User::setMoviesWatched(vector<Movie> movies_watched) {
    this->movies_watched = movies_watched;
}

const UID &User::getId() const {
    return id;
}

bool User::hasWatchedMovie(const Movie& movie) const {
    // Iterate through the movies watched by the user and check if the movie is present
    if (find(movies_watched.begin(), movies_watched.end(),
        movie) != movies_watched.end()) {
        return true;
    } else {
        return false;
    }
}
