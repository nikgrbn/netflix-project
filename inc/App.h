#ifndef NETFLIX_PROJECT_APP_H
#define NETFLIX_PROJECT_APP_H

#include "ICommand.h"
#include "IMenu.h"

#include <iostream>
#include <map>
#include <vector>
#include <sstream>
using namespace std;

class App {
private:
    const map<string, ICommand*>& commands;
    IMenu* menu;
public:
    App(IMenu* menu, const map<string, ICommand*>& commands);
    void run();
};


#endif //NETFLIX_PROJECT_APP_H
