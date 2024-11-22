#include "App.h"

int main() {
    map<string, ICommand*> commands;

    ICommand* helloWorldCommand = new HelloWorldCommand();
    commands["saying-hi"] = helloWorldCommand;

    App app(commands); // Create an instance of App
    app.run(); // Start the application

    delete helloWorldCommand; // Free the memory

    return 0; // Exit the application
}
