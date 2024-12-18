#ifndef NETFLIX_PROJECT_SOCKETMENU_H
#define NETFLIX_PROJECT_SOCKETMENU_H

#include "menu/IMenu.h"
#include "utils/StatusCodeException.h"
#include "utils/Types.h"
#include <sstream>
#include <cstring>

class SocketMenu : public IMenu {
private:
    SocketData *socketData;
    static vector<string> splitString(string& input, char delimiter);
public:
    explicit SocketMenu(SocketData *socketData);

    vector<string> nextCommand() override;
    void out(string output) override;
private:
    void clearSocketBuffer();
};


#endif //NETFLIX_PROJECT_SOCKETMENU_H
