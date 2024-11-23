#ifndef NETFLIX_PROJECT_MOVIE_H
#define NETFLIX_PROJECT_MOVIE_H

#include <iostream>

using namespace std;

class Movie {
private:
    string id;
public:
    Movie(string& id) : id(id) {};
    string getId();
};


#endif //NETFLIX_PROJECT_MOVIE_H
