//
// Created by Nikita on 11/22/2024.
//

#include "../inc/HelloWorldCommand.h"

string HelloWorldCommand::execute(vector<string> commands) {
    return "Hello, World!";
}

string HelloWorldCommand::info() {
    return "Prints 'Hello, World!'";
}
