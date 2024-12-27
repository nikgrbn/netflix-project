const errors = {
    USERNAME_PASSWORD_REQUIRED: 'Username and password are required',
    USERNAME_ALREADY_EXISTS: 'Username already exists',
    USER_NOT_FOUND: 'User not found',

    INVALID_CREDENTIALS: 'Invalid username or password',

    CATEGORY_ALREADY_EXISTS: 'Category already exists',
    CATEGORY_NOT_FOUND: 'Category not found',
    CATEGORY_NAME_REQUIRED: 'Category name is required',

    MOVIE_ALREADY_EXISTS: 'Movie already exists',
    MOVIE_NOT_FOUND: 'Movie not found',
    MOVIE_FIELDS_REQUIRED: 'all feilds are required',
    MOVIE_PUT_ERROR: 'must change all fields',

    BAD_REQUEST: 'Bad request',
    ID_HEADER_REQUIRED: 'User-ID header is required',
};

module.exports = errors;