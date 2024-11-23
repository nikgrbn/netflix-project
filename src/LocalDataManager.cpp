//
// Created by Nikita on 11/23/2024.
//

#include "LocalDataManager.h"

LocalDataManager::LocalDataManager() {
    if (!filesystem::exists("data")) {
        filesystem::create_directory("data");
    }
    if (!filesystem::exists(filePath)) {
        ofstream file(filePath);
        file.close();
    }
}

void LocalDataManager::save(vector<User> &users) {
    ofstream file(filePath);
    if (!file.is_open()) {
        throw runtime_error("Failed to open file for saving.");
    }

    for (auto& user : users) {
        file << user.getId();
        for (auto& movie : user.getMoviesWatched()) {
            file << " " << movie.getId();
        }
        file << "\n"; // End line for each user
    }
}

vector<User> LocalDataManager::load() {
    ifstream file(filePath);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open file for loading.");
    }

    vector<User> users;
    string line;

    while (getline(file, line)) {
        istringstream iss(line);
        string user_id;
        iss >> user_id;

        std::vector<Movie> watched_movies;
        string movie_id;

        while (iss >> movie_id) {
            watched_movies.emplace_back(movie_id);
        }

        users.emplace_back(user_id, watched_movies);
    }

    return users;
}


void LocalDataManager::set(User user) {
    // Load all users from the file
    vector<User> users = load();

    // Check if the user already exists
    auto it = find_if(users.begin(), users.end(), [&](User& u) { // TODO Refactor for readability
        return u.getId() == user.getId();
    });

    if (it != users.end()) {
        // User exists, update their movies
        it->setMoviesWatched(user.getMoviesWatched());
    } else {
        // User does not exist, add them
        users.push_back(user);
    }

    // Save updated users back to the file
    save(users);
}
