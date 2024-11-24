#ifndef NETFLIX_PROJECT_IMENU_H
#define NETFLIX_PROJECT_IMENU_H

#include <iostream>
#include <vector>

using namespace std;

class IMenu {
public:
    virtual vector<string> nextCommand() = 0;
    virtual ~IMenu() = default;
};

#endif //NETFLIX_PROJECT_IMENU_H