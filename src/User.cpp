//
// Created by Nikita on 11/23/2024.
//

#include "User.h"


string User::getId() {
    return this->id;
}

vector<Movie> User::getMoviesWatched() {
    return this->movies_watched;
}

void User::setMoviesWatched(vector<Movie> movies_watched) {
    this->movies_watched = movies_watched;
}
