#ifndef NETFLIX_PROJECT_CONSOLEMENU_H
#define NETFLIX_PROJECT_CONSOLEMENU_H

#include "IMenu.h"
#include <iostream>
#include <map>
#include <vector>
#include <sstream>

using namespace std;

class ConsoleMenu : public IMenu {
private:
    static vector<string> splitString(string& input, char delimiter);
public:
    vector<string> nextCommand() override;
    void print(string output) override;
};

#endif //NETFLIX_PROJECT_CONSOLEMENU_H