#include <utility>

#include "../inc/App.h"

App::App(IMenu* menu, map<string, ICommand*> commands) : menu(menu), commands(std::move(commands)) {}

void App::run() {
    string task;
    while (true) {
        // Get next command tokens
        vector<string> task = menu->nextCommand();
        
        try {
            // Check if the key exists in the map
            if (commands.find(task[0]) == commands.end() || !commands[task[0]]) {
                throw std::runtime_error("Command not found");
            }

            commands[task[0]]->execute();
        } catch (const std::exception& e) {
            // Skip to the next iteration
        }
    }
}