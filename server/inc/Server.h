//
// Created by Nikita on 12/5/2024.
//

#ifndef NETFLIX_PROJECT_SERVER_H
#define NETFLIX_PROJECT_SERVER_H


#include "ICommand.h"
#include "IMenu.h"

#include <iostream>
#include <map>
#include <vector>
#include <sstream>
using namespace std;

class Server {
private:
    IMenu* menu;
    map<string, ICommand*>& commands;

public:
    Server(IMenu* menu, map<string, ICommand*>& commands);
    void run();
};


#endif //NETFLIX_PROJECT_SERVER_H
