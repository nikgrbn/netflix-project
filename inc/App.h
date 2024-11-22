//
// Created by Nikita on 11/22/2024.
//

#ifndef NETFLIX_PROJECT_APP_H
#define NETFLIX_PROJECT_APP_H

class App {
private:
    map<string, ICommand*> commands;
public:
    App(map<string, ICommand*> commands);

    void run();
};


#endif //NETFLIX_PROJECT_APP_H
