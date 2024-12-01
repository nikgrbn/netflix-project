#include "../inc/HelpCommand.h"

// Constructor: Initializes the HelpCommand
HelpCommand::HelpCommand(const std::map<std::string, ICommand*>& commands) : commands(commands) {}

// Execute: Prints the command menu
void HelpCommand::execute(const std::vector<std::string>& args) {
    
    for (const auto& command : commands) {
        std::cout << command.second.info() << std::endl;
    }
}

// Returns a description of the help command
std::string HelpCommand::info() const {
    return "help";
}

