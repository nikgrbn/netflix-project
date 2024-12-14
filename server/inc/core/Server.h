#ifndef NETFLIX_PROJECT_SERVER_H
#define NETFLIX_PROJECT_SERVER_H

#include "commands/ICommand.h"
#include "menu/IMenu.h"
#include "utils/Types.h"
#include "menu/SocketMenu.h"
#include "utils/SocketRAII.h"
#include "utils/StatusCodeException.h"
#include <map>
#include <iostream>
#include <sys/socket.h>
#include <cstdio>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <thread>
#include <mutex>

using namespace std;

class Server {
private:
    map<string, ICommand*>& commands;
    const int server_port;
    mutex cmdExecMtx;
public:
    explicit Server(map<string, ICommand*>& commands, int server_port=12345);

    void run();
    void handleClient(SocketData* data);
};


#endif //NETFLIX_PROJECT_SERVER_H
