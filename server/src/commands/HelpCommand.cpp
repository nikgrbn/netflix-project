#include "commands/HelpCommand.h"

// Constructor: Initializes the HelpCommand
HelpCommand::HelpCommand(const std::map<std::string, ICommand*>& commands) : commands(commands) {}

// Execute: Prints the command menu
std::string HelpCommand::execute(const vector<string>& commands) {
    if (commands.size() != 1) { // Check if exactly 1 argument is provided
        throw StatusCodeException(StatusCodes::BAD_REQUEST);
    }

    std::stringstream ss;
    for (const auto& command : this->commands) {
        if(command.second->info() == this->info()) {
            continue;
        }
        ss << command.second->info() << std::endl;
    }
    ss << this->info();

    return ss.str();
}

// Returns a description of the help command
std::string HelpCommand::info() const {
    return "help";
}

