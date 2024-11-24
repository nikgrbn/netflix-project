//
// Created by Nikita on 11/22/2024.
//

#include "../inc/HelloWorldCommand.h"

void HelloWorldCommand::execute(vector<string> commands) {
    cout << "Hello, World!" << endl;
}

string HelloWorldCommand::info() {
    return "Prints 'Hello, World!'";
}
