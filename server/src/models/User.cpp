#include "models/User.h"

bool User::operator==(const User &user) const {
    return this->id == user.id;
}

void User::addMovie(Movie movie) {
    // Check if movie already in user's watched
    if (find(movies_watched.begin(), movies_watched.end(),
        movie) == movies_watched.end()) {
        // If not -> add it
        this->movies_watched.push_back(movie);
    }
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
    for (size_t i = 0; i < movies_watched.size(); i++) {
        if (movies_watched[i] == movie) {
            return true;
        }
    }
    return false;
}
