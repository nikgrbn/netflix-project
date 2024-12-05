#ifndef NETFLIX_PROJECT_SERVER_H
#define NETFLIX_PROJECT_SERVER_H

#include "ICommand.h"
#include "IMenu.h"
#include "Types.h"
#include <map>
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <thread>

using namespace std;

class Server {
private:
    IMenu* menu;
    map<string, ICommand*>& commands;

public:
    Server(IMenu* menu, map<string, ICommand*>& commands);

    void run();
    static void handleClient(void* socketData);
};


#endif //NETFLIX_PROJECT_SERVER_H
