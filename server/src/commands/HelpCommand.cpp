#include "commands/HelpCommand.h"

// Constructor: Initializes the HelpCommand
HelpCommand::HelpCommand(const std::map<std::string, ICommand*>& commands) : commands(commands) {}

// Execute: Prints the command menu
std::string HelpCommand::execute(const vector<string>& commands) {
    if (commands.size() != 1) { // Check if exactly 1 argument is provided
        throw StatusCodeException(StatusCodes::BAD_REQUEST);
    }

    // Collect all command names and sort them alphabetically
    std::vector<std::string> commandNames;
    for (const auto& command : this->commands) {
        commandNames.push_back(command.first);
    }
    std::sort(commandNames.begin(), commandNames.end());

    // Build the output string
    std::stringstream ss;
    for (auto it = commandNames.begin(); it != commandNames.end(); ++it) {
        if(*it == "help") {
            continue;
        }
        ss << this->commands.at(*it)->info();

        if (std::next(it) != commandNames.end()) { 
            ss << std::endl;
    }
   
}
    ss << this->info();

    return ss.str();
}

// Returns the description of the HelpCommand
std::string HelpCommand::info() const {
    return "help";
}

