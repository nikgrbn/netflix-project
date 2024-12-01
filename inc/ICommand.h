
#ifndef NETFLIX_PROJECT_ICOMMAND_H
#define NETFLIX_PROJECT_ICOMMAND_H

#include <iostream>
#include <vector>

using namespace std;

class ICommand {
public:
    virtual string info() const = 0;
    virtual string execute(vector<string>& commands) = 0;

    virtual ~ICommand() = default;
};


#endif //NETFLIX_PROJECT_ICOMMAND_H
