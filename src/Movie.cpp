//
// Created by Nikita on 11/23/2024.
//

#include "Movie.h"

bool Movie::operator==(const Movie &movie) const {
    return this->id == movie.id;
}

string Movie::getId() {
    return this->id;
}
