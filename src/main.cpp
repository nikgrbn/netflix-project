#include "../inc/AddCommand.h"
#include "../inc/RecommendCommand.h"
#include "../inc/App.h"
#include "../inc/ConsoleMenu.h"
#include "../inc/HelloWorldCommand.h"
#include "../inc/LocalDataManager.h"

#include <iostream>
#include <map>

using namespace std;

int main() {
    // Create an instance of LocalDataManager
    IDataManager* dataManager = new LocalDataManager();

    // Create a map of commands
    map<string, ICommand*> commands;

    // TODO: Remove
    ICommand* helloWorldCommand = new HelloWorldCommand();
    commands["saying-hi"] = helloWorldCommand;

    ICommand* addCommand = new AddCommand(dataManager);
    commands["add"] = addCommand;

    ICommand* recommendCommand = new RecommendCommand(dataManager);
    commands["recommend"] = recommendCommand;

    // Create an instance of CLI menu
    IMenu* menu = new ConsoleMenu();

    App app(menu, commands); // Create an instance of App
    app.run(); // Start the application

    delete helloWorldCommand; // Free the memory
    delete menu; // Free the memory

    return 0; // Exit the application
}
