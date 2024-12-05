//
// Created by Nikita on 12/5/2024.
//

#ifndef NETFLIX_PROJECT_SOCKETMENU_H
#define NETFLIX_PROJECT_SOCKETMENU_H


#include "IMenu.h"
#include "Types.h"
#include <sstream>

class SocketMenu : public IMenu {
private:
    SocketData *socketData;
    static vector<string> splitString(string& input, char delimiter);
public:
    explicit SocketMenu(SocketData *socketData);

    vector<string> nextCommand() override;
    void out(string output) override;
};


#endif //NETFLIX_PROJECT_SOCKETMENU_H
