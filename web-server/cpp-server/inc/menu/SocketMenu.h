#ifndef NETFLIX_PROJECT_SOCKETMENU_H
#define NETFLIX_PROJECT_SOCKETMENU_H

#include "menu/IMenu.h"
#include "utils/StatusCodeException.h"
#include "utils/Types.h"
#include <sstream>
#include <cstring>
#include <memory>

class SocketMenu : public IMenu {
private:
    std::shared_ptr<SocketData> socketData;
    static vector<string> splitString(string& input, char delimiter);
public:
    explicit SocketMenu(std::shared_ptr<SocketData> data);

    vector<string> nextCommand() override;
    void out(string output) override;
private:
    void clearSocketBuffer();
};


#endif //NETFLIX_PROJECT_SOCKETMENU_H
