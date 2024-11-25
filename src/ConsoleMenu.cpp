#include "../inc/ConsoleMenu.h"

vector<string> ConsoleMenu::nextCommand() {
    string command;
    std::getline(std::cin, command);

    // Return the tokens of the command
    return splitString(command, ' ');
}

// Function to split a string into tokens based on a
// delimiter
vector<string> ConsoleMenu::splitString(string& input, char delimiter)
{
    // Creating an input string stream from the input string
    istringstream stream(input);

    // Vector to store the tokens
    vector<string> tokens;

    // Temporary string to store each token
    string token;

    // Read tokens from the string stream separated by the
    // delimiter
    while (getline(stream, token, delimiter)) {
        // Add the token to the vector of tokens
        tokens.push_back(token);
    }

    // Return the vector of tokens
    return tokens;
}
