#ifndef NETFLIX_PROJECT_CONSOLEMENU_H
#define NETFLIX_PROJECT_CONSOLEMENU_H

#include "menu/IMenu.h"
#include <unistd.h>
#include <vector>
#include <sstream>

using namespace std;

class ConsoleMenu : public IMenu {
private:
    static vector<string> splitString(string& input, char delimiter);
public:
    vector<string> nextCommand() override;
    void out(string output) override;
};

#endif //NETFLIX_PROJECT_CONSOLEMENU_H