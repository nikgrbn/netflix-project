#ifndef NETFLIX_PROJECT_CONSOLEMENU_H
#define NETFLIX_PROJECT_CONSOLEMENU_H

#include "IMenu.h"

class ConsoleMenu : public IMenu {

public:
    string nextCommand() override;

};

#endif //NETFLIX_PROJECT_CONSOLEMENU_H