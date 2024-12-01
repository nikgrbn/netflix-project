#include "../inc/HelpCommand.h"


// Constructor: Initializes the HelpCommand
HelpCommand::HelpCommand(const std::unordered_map<std::string, std::shared_ptr<ICommand>>& commandHandlers)
    : commandHandlers(commandHandlers) {}

// Execute: Prints the command menu
void HelpCommand::execute(const std::vector<std::string>& args) {
    if (!args.empty()) {
        // Ignore arguments since "help" does not require any
        return;
    }

    // Print the menu exactly as specified
    std::cout << "add [userid] [movieid1] [movieid2] …" << std::endl;
    std::cout << "recommend [userid] [movieid]" << std::endl;
    std::cout << "help" << std::endl;
}

// Returns a description of the help command
std::string HelpCommand::info() const {
    return "help";
}

