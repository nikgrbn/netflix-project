#include "../inc/App.h"

App::App(map<string, ICommand*> commands) : commands(commands) {}

void App::run() {
    string task;
    while (true) {
        cin >> task;

        try {
            commands[task]->execute();
        } catch (...) {
            std::cout << "Command not found!" << std::endl;
        }
    }
}
