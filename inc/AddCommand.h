//
// Created by nikita on 11/24/24.
//

#ifndef ADDCOMMAND_H
#define ADDCOMMAND_H

#include <iostream>

using namespace std;

class AddCommand {
  private:
    string command;
  public:
    AddCommand(string command) : command(command) {}
};

#endif //ADDCOMMAND_H
