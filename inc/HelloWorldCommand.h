//
// Created by Nikita on 11/22/2024.
//

#ifndef NETFLIX_PROJECT_HELLOWORLDCOMMAND_H
#define NETFLIX_PROJECT_HELLOWORLDCOMMAND_H

#include "ICommand.h"

class HelloWorldCommand : public ICommand {
public:
    string info() override;
    string execute(vector<string> commands) override;
};


#endif //NETFLIX_PROJECT_HELLOWORLDCOMMAND_H
