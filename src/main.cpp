#include "App.h"
#include "IMenu.h"
#include "ConsoleMenu.h"
#include "HelloWorldCommand.h"
#include "ICommand.h"

#include <iostream>
#include <map>

using namespace std;

int main() {
    map<string, ICommand*> commands;
    
    IMenu* menu = new ConsoleMenu();

    ICommand* helloWorldCommand = new HelloWorldCommand();
    commands["saying-hi"] = helloWorldCommand;

    App app(menu, commands); // Create an instance of App
    app.run(); // Start the application

    delete helloWorldCommand; // Free the memory
    delete menu; // Free the memory

    return 0; // Exit the application
}
