#ifndef NETFLIX_PROJECT_HELPCOMMAND_H
#define NETFLIX_PROJECT_HELPCOMMAND_H

#include "IDataManager.h"
#include <iostream>
#include <vector>
#include "ICommand.h"
#include "AddCommand.h"
#include "RecommendCommand.h"

using namespace std;

class HelpCommand : public ICommand {
public:
    // Constructor to accept the list of commands and their handlers
    HelpCommand(const std::unordered_map<std::string, std::shared_ptr<ICommand>>& commandHandlers);

    // Override execute to print all commands
    void execute(const std::vector<std::string>& args = {}) override;

    // Description for the help command
    string info() const override;

private:
    const std::unordered_map<std::string, std::shared_ptr<ICommand>>& commandHandlers;
};



#endif //NETFLIX_PROJECT_HELPCOMMAND_H