#include "commands/AddCommand.h"
#include "commands/RecommendCommand.h"
#include <commands/DeleteCommand.h>
#include "commands/HelpCommand.h"
#include "commands/PatchCommand.h"
#include "core/Server.h"
#include "data_manager/LocalDataManager.h"
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
    commands["POST"] = (ICommand*) new AddCommand(dataManager);
    commands["GET"] = (ICommand*) new RecommendCommand(dataManager);
    commands["PATCH"] = (ICommand*) new PatchCommand(dataManager);
    commands["DELETE"] = (ICommand*) new DeleteCommand(dataManager);
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
