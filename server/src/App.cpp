#include <utility>

#include "../inc/App.h"
#include "../inc/HelpCommand.h"

App::App(IMenu* menu, map<string, ICommand*>& commands) : menu(menu), commands(commands) {}

void App::run() {
    string task;
    while (true)
    {
        try {
            vector<string> args = menu->nextCommand();
            if (args.empty()) {
                throw std::runtime_error("No command provided");
            }

            auto it = commands.find(args[0]);
            if (it == commands.end() || !(it->second)) {
                throw std::runtime_error("Command not found");
            }

            string res = it->second->execute(args);
            if (!res.empty()) {
                menu->print(res);
            }
        } catch (const std::exception& e) {
            // Skip to the next iteration
        }
    }
}