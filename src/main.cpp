#include "App.h"
#include "IMenu.h"
#include "ConsoleMenu.h"
#include "HelloWorldCommand.h"
#include "ICommand.h"
#include "LocalDataManager.h"

#include <iostream>
#include <map>

using namespace std;

int main() {
    map<string, ICommand*> commands;

    IDataManager* dataManager = new LocalDataManager();
    User user1("1", vector<Movie> { Movie("11"), Movie("5"), Movie("100") });
    User user2("2", vector<Movie> { Movie("123"), Movie("331") });
    dataManager->set(user1);
    dataManager->set(user2);

    IMenu* menu = new ConsoleMenu();

    ICommand* helloWorldCommand = new HelloWorldCommand();
    commands["saying-hi"] = helloWorldCommand;

    App app(menu, commands); // Create an instance of App
    app.run(); // Start the application

    delete helloWorldCommand; // Free the memory
    delete menu; // Free the memory

    return 0; // Exit the application
}
