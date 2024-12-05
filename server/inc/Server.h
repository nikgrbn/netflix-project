#ifndef NETFLIX_PROJECT_SERVER_H
#define NETFLIX_PROJECT_SERVER_H

#include "ICommand.h"
#include "IMenu.h"
#include <map>
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>

using namespace std;

class Server {
private:
    IMenu* menu;
    map<string, ICommand*>& commands;

public:
    Server(IMenu* menu, map<string, ICommand*>& commands);

    void run();
    static void handleClient(int clientSocket);
};


#endif //NETFLIX_PROJECT_SERVER_H
