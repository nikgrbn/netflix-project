#ifndef NETFLIX_PROJECT_USER_H
#define NETFLIX_PROJECT_USER_H

#include <iostream>
#include <utility>
#include <vector>
#include <algorithm>
#include "Movie.h"
#include "utils/Types.h"

using namespace std;

class User {
private:
    UID id;
    vector<Movie> movies_watched;
public:
    User(UID id, vector<Movie> movies_watched = {}) : id(id), movies_watched(movies_watched) {};
    const UID &getId() const;
    const vector<Movie> getMoviesWatched() const;
    bool operator==(const User& user) const;

    void addMovie(Movie movie);
    void setMoviesWatched(vector<Movie> movies_watched);

    bool hasWatchedMovie(const Movie& Movie) const;
};


#endif //NETFLIX_PROJECT_USER_H
