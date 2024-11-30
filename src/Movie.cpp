//
// Created by Nikita on 11/23/2024.
//

#include "../inc/Movie.h"

bool Movie::operator==(const Movie &movie) const {
    return this->id == movie.id;
}

const UID &Movie::getId() const {
    return this->id;
}
