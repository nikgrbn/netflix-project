#include "models/Movie.h"

bool Movie::operator==(const Movie &movie) const {
    return this->id == movie.id;
}

const UID &Movie::getId() const {
    return this->id;
}
