#include <utility>

#include "../inc/App.h"

App::App(map<string, ICommand*> commands) : commands(std::move(commands)) {}

void App::run() {
    string task;
    while (true) {
        cin >> task;

        try {
            // Check if the key exists in the map
            if (commands.find(task) == commands.end()) {
                throw std::runtime_error("Command not found!");
            }

            // Check if the command pointer is not null
            if (!commands[task]) {
                throw std::runtime_error("Command is null!");
            }

            commands[task]->execute();
        } catch (const std::exception& e) {
            // Skip to the next iteration
        }
    }
}
