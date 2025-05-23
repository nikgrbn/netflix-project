#include "menu/ConsoleMenu.h"

vector<string> ConsoleMenu::nextCommand() {
    string command;
    std::getline(std::cin, command);

    // Check if stdin is a terminal
    // (HAPPENS IF --rm -it FLAGS AREN'T PASSED IN DOCKER run COMMAND)
    if (!isatty(fileno(stdin))) {
        // Non-interactive mode: simulate input or handle gracefully
        std::cerr << "Non-interactive mode detected."
                     "\nDid you pass --rm -it flags in the docker run command?"
                     "\nExiting..." << std::endl;
        exit(0);
    }

    return splitString(command, ' ');
}


// Function to split a string into tokens based on a
// delimiter
vector<string> ConsoleMenu::splitString(string& input, char delimiter)
{
    // Checks for tabs or other illegal whitespace characters
    for (char& ch : input) {
        if (ch != delimiter && isspace(ch)) {
            throw runtime_error("Invalid whitespace character found.");
        }
    }

    // Creating an input string stream from the input string
    istringstream stream(input);

    // Vector to store the tokens
    vector<string> tokens;

    // Temporary string to store each token
    string token;

    // Read tokens from the string stream separated by the delimiter
    while (getline(stream, token, delimiter)) {
        if (!token.empty()) {  // Ignore empty tokens caused by consecutive spaces
            tokens.push_back(token);
        }
    }

    // Return the vector of tokens
    return tokens;
}

void ConsoleMenu::out(string output) {
    cout << output << endl;
}