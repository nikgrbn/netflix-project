#ifndef NETFLIX_PROJECT_HELPCOMMAND_H
#define NETFLIX_PROJECT_HELPCOMMAND_H

#include "data_manager/IDataManager.h"
#include <iostream>
#include <vector>
#include "ICommand.h"
#include "AddCommand.h"
#include "RecommendCommand.h"

class HelpCommand : public ICommand {
public:
    // Constructor to accept the list of commands and their handlers
    HelpCommand(const std::map<std::string, ICommand*>& commands); // 0x300

    // Override execute to print all commands
    string execute(const vector<string>& commands) override;

    // Description for the help command
    std::string info() const override;

private:
    const std::map<std::string, ICommand*>& commands;
};



#endif //NETFLIX_PROJECT_HELPCOMMAND_H