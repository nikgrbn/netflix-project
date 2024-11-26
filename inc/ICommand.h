//
// Created by Nikita on 11/22/2024.
//

#ifndef NETFLIX_PROJECT_ICOMMAND_H
#define NETFLIX_PROJECT_ICOMMAND_H

#include <iostream>
#include <vector>

using namespace std;

class ICommand {
public:
    virtual string info() = 0;
    virtual string execute(vector<string> commands) = 0;
};


#endif //NETFLIX_PROJECT_ICOMMAND_H
