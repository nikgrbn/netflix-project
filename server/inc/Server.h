#ifndef NETFLIX_PROJECT_SERVER_H
#define NETFLIX_PROJECT_SERVER_H

#include "ICommand.h"
#include "IMenu.h"
#include "Types.h"
#include "SocketMenu.h"
#include "SocketRAII.h"
#include "InvalidCommandException.h"
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
    map<string, ICommand*>& commands;
    const int server_port;
public:
    explicit Server(map<string, ICommand*>& commands, int server_port=12345);

    void run();
    void handleClient(SocketData* data);
};


#endif //NETFLIX_PROJECT_SERVER_H
