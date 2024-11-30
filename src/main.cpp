#include "../inc/AddCommand.h"
#include "../inc/RecommendCommand.h"
#include "../inc/App.h"
#include "../inc/ConsoleMenu.h"
#include "../inc/LocalDataManager.h"
#include <iostream>
#include <map>

using namespace std;

int main() {
    // Create an instance of LocalDataManager
    IDataManager* dataManager = new LocalDataManager();

    // Create a map of commands
    map<string, ICommand*> commands;
    commands["add"] = (ICommand*) new AddCommand(dataManager);
    commands["recommend"] = (ICommand*) new RecommendCommand(dataManager);

    // Create an instance of CLI menu
    IMenu* menu = new ConsoleMenu();

    App app(menu, commands); // Create an instance of App
    app.run(); // Start the application

    // Free the memory
    delete dataManager;
    for (const auto& command : commands) {
        delete command.second;
    }
    delete menu;

    return 0;
}
