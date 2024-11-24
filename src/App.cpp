#include <utility>

#include "../inc/App.h"

App::App(IMenu* menu, map<string, ICommand*> commands) : menu(menu), commands(std::move(commands)) {}

void App::run() {
    string task;
    while (true) {
        // Get next command arguments
        vector<string> args = menu->nextCommand();
        
        try {
            // Check if the key exists in the map
            if (commands.find(args[0]) == commands.end() || !commands[args[0]]) {
                throw std::runtime_error("Command not found");
            }

            commands[args[0]]->execute(args);
        } catch (const std::exception& e) {
            // Skip to the next iteration
        }
    }
}