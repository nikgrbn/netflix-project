#include "../inc/AddCommand.h"
#include "../inc/RecommendCommand.h"
#include "../inc/HelpCommand.h"
#include "../inc/Server.h"
#include "../inc/ConsoleMenu.h"
#include "../inc/LocalDataManager.h"
#include <iostream>
#include <map>

using namespace std;

int main(int argc, const char * argv[]) {
    // Get the port number from the command line arguments
    int port;
    try {
        port = stoi(argv[1]);
    } catch (exception& e) {
        port = 12345;
    }

    // Create an instance of LocalDataManager
    IDataManager* dataManager = new LocalDataManager();

    // Create a map of commands
    map<string, ICommand*> commands;
    commands["add"] = (ICommand*) new AddCommand(dataManager);
    commands["recommend"] = (ICommand*) new RecommendCommand(dataManager);
    commands["help"] = (ICommand*) new HelpCommand(commands);

    Server server(commands, port); // Create an instance of server
    server.run(); // Start the server

    // Free the memory
    delete dataManager;
    for (const auto& command : commands) {
        delete command.second;
    }

    return 0;
}
