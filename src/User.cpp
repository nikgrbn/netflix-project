#include "../inc/User.h"


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

vector<Movie> User::getMoviesWatched() {
    return this->movies_watched;
}

void User::setMoviesWatched(vector<Movie> movies_watched) {
    this->movies_watched = movies_watched;
}

const UID &User::getId() const {
    return id;
}
