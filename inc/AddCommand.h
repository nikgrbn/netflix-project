//
// Created by nikita on 11/24/24.
//

#ifndef NETFLIX_PROJECT_ADDCOMMAND_H
#define NETFLIX_PROJECT_ADDCOMMAND_H

#include <iostream>
#include <vector>
#include "ICommand.h"

using namespace std;

class AddCommand : public ICommand {
  public:
    string info() override;
    void execute(vector<string> commands) override;
};

#endif //NETFLIX_PROJECT_ADDCOMMAND_H
