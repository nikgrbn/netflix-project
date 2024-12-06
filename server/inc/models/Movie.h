#ifndef NETFLIX_PROJECT_MOVIE_H
#define NETFLIX_PROJECT_MOVIE_H

#include <iostream>
#include "utils/Types.h"

using namespace std;

class Movie {
private:
    UID id;
public:
    explicit Movie(UID id) : id(id) {};
    const UID &getId() const;
    bool operator==(const Movie& movie) const;
};


#endif //NETFLIX_PROJECT_MOVIE_H
