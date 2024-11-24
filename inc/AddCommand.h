//
// Created by nikita on 11/24/24.
//

#ifndef ADDCOMMAND_H
#define ADDCOMMAND_H

#include <iostream>
#include <vector>
#include "ICommand.h"

using namespace std;

class AddCommand : public ICommand {
  public:
    string info() override;
    void execute(vector<string> commands) override;
};

#endif //ADDCOMMAND_H
