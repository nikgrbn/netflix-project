//
// Created by Nikita on 11/23/2024.
//

#ifndef NETFLIX_PROJECT_USER_H
#define NETFLIX_PROJECT_USER_H

#include <iostream>
#include <vector>
#include <algorithm>
#include "Movie.h"

using namespace std;

class User {
private:
    string id;
    vector<Movie> movies_watched;
public:
    User(string id, vector<Movie> movies_watched) : id(id), movies_watched(movies_watched) {};
    string getId();
    void addMovie(Movie movie);
    vector<Movie> getMoviesWatched();
    void setMoviesWatched(vector<Movie> movies_watched);
};


#endif //NETFLIX_PROJECT_USER_H
