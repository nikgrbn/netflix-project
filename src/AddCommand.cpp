//
// Created by nikita on 11/24/24.
//

#include "../inc/AddCommand.h"

void AddCommand::execute(vector<string> commands) {
    if (commands.size() <= 2) { // Check if at least 3 arguments are provided
        throw invalid_argument("Invalid number of arguments");
    }
    // TODO: Implement the execute method
}

string AddCommand::info() {
    return "add [userid] [movieid1] [movieid2] …";
}