#include <utility>

#include "../inc/App.h"
#include "../inc/HelpCommand.h"

App::App(IMenu* menu, map<string, ICommand*> commands) : menu(menu), commands(std::move(commands)) {}

void App::run() {
    string task;
    while (true) {
        try {
            // Get next command arguments
            vector<string> args = menu->nextCommand();

            // Check if the key exists in the map
            if (commands.find(args[0]) == commands.end() || !commands[args[0]]) {
                throw std::runtime_error("Command not found");
            }

            string res = commands[args[0]]->execute(args);
            if (!res.empty()) { // Print execution result if not empty
                menu->print(res);
            }
        } catch (const std::exception& e) {
            // Skip to the next iteration
        }
    }
}