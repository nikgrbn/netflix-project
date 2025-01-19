const errors = {
    USERNAME_PASSWORD_REQUIRED: 'Username and password are required',
    USERNAME_ALREADY_EXISTS: 'Username already exists',
    USER_NOT_FOUND: 'User not found',
    USER_NOT_CREATED: 'User not created',

    INVALID_CREDENTIALS: 'Invalid username or password',

    CATEGORY_ALREADY_EXISTS: 'Category already exists',
    CATEGORY_NOT_FOUND: 'Category not found',
    CATEGORY_NAME_REQUIRED: 'Category name is required',
    CATEGORY_NOT_CREATED: 'Category not created',

    MOVIE_NAME_REQUIRED: "Movie name is required.",
    MOVIE_NOT_CREATED: "Failed to create movie.",
    MOVIE_NOT_FOUND: "Movie not found.",
    CATEGORY_NOT_FOUND: "Category not found.",
    MOVIE_ID_MODIFY: "Movie ID cannot be modified.",
    MOVIE_FETCH_ERROR: "An error occurred while fetching movies.",
    MOVIE_ERROR_CREATION: "An error occurred while creating the movie.",
    MOVIE_UPDATE_ERROR: "An error occurred while updating the movie.",
    MOVIE_DELETE_ERROR: "An error occurred while deleting the movie.",
    MOVIE_REMOTE_DELETE_ERROR: "Failed to delete movie on remote server",
    MOVIE_ROLLBACK_ERROR: "Failed to delete movie and rollback failed",
    MOVIE_ROLLBACK_SUCCESS: "Failed to delete movie and rollback done",
    MOVIE_DELETE_USER_ERROR: "Failed to delete movie from user",

    BAD_REQUEST: 'Bad request',
    TOKEN_REQUIREDED: 'Token is required',
    TOKEN_NOT_VALID: 'Token not valid',

    MRS_CONNECTION_ERROR: 'Could not connect to the MRS server',
    MRS_CONNECTION_CLOSED: 'Connection to the MRS server closed unexpectedly',
    MRS_NOT_CONNECTED: 'Not connected to the MRS server',
};

const counters = {
    C_USER: 'users',
    C_CATEGORY: 'categories',
    C_MOVIE: 'movies',
};

const utils = {
    MAX_MOVIES: 20,
    UNIQUE_CATEGORY: 'Previous movies you have watched',
};

module.exports = {
    errors,
    counters,
    utils
};