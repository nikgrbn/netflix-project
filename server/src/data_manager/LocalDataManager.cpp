#include "data_manager/LocalDataManager.h"

LocalDataManager::LocalDataManager() : users(), mtx() {
    if (!filesystem::exists("data")) { // TODO remove hard coded path
        filesystem::create_directory("data");
    }
    if (!filesystem::exists(filePath)) {
        // Create a file by opening a new output file stream.
        ofstream file(filePath);
        file.close();
    }

    // Load all users from the file
    loadUsersFromFile(filePath);
}

LocalDataManager::~LocalDataManager() {
    // Save the data once the object is destroyed.
    save();
}

void LocalDataManager::loadUsersFromFile(std::string filename) {
    ifstream file(filePath);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open file for loading.");
    }

    string line;

    while (getline(file, line)) {
        if (line.empty()) {
            continue;
        }

        istringstream iss(line);
        string user_id;
        iss >> user_id;

        std::vector<Movie> watched_movies;
        string movie_id;

        while (iss >> movie_id) {
            watched_movies.emplace_back(UID(movie_id));
        }

        users.emplace_back(UID(user_id), watched_movies);
    }
}

void LocalDataManager::save() {
    ofstream file(filePath);
    if (!file.is_open()) {
        throw runtime_error("Failed to open file for saving.");
    }

    for (auto& user : users) {
        file << user.getId().toString();
        for (auto& movie : user.getMoviesWatched()) {
            file << " " << movie.getId().toString();
        }
        file << "\n"; // End line for each user
    }
}

vector<User> LocalDataManager::load() {
    // Creates a copy of the vector array.
    return users;
}


/**
 * Set user entry in data,
 * if does not exist, create a new entry
 */
void LocalDataManager::set(User user) {
    // Lock at the start, lock gets released at the end.
    std::lock_guard<std::mutex> lock(mtx);
    users.push_back(user);
    save();
}


/**
 * Update user entry in data,
 * if does not exist, create a new entry
 */
void LocalDataManager::update(User user) {
    // Lock at the start, lock gets released at the end.
    std::lock_guard<std::mutex> lock(mtx);

    // Check if the user already exists
    auto it = find_if(users.begin(), users.end(), [&](User& u) {
        return u.getId() == user.getId();
    });

    if (it != users.end()) {
        // User exists, update their movies
        for (auto& movie : user.getMoviesWatched()) {
            it->addMovie(movie);
        }
    } else {
        // User does not exist, add them
        users.push_back(user);
    }

    save();
}


std::optional<User> LocalDataManager::get(const UID& id) {
    std::lock_guard<std::mutex> lock(mtx);

    // Find user by ID
    auto it = find_if(users.begin(), users.end(), [&](const User& user) {
        return user.getId() == id;
    });

    if (it == users.end()) {
        return std::nullopt;
    }

    return *it;
}
