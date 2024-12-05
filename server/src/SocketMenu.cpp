#include "SocketMenu.h"

SocketMenu::SocketMenu(SocketData *socketData) : socketData(socketData) {}

vector<string> SocketMenu::nextCommand() {
    // Read from the client
    int bytes = recv(socketData->client_socket,
                     socketData->buffer,
                     sizeof(socketData->buffer),
                     0);
    if (bytes <= 0) {
        throw std::runtime_error("Client disconnected or error occurred.");
    }

    // Split commands by specific delimiter
    string command(socketData->buffer, bytes);
    return splitString(command, ' ');
}

// Function to split a string into tokens based on a
// delimiter
vector<string> SocketMenu::splitString(string& input, char delimiter)
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

void SocketMenu::out(string output) {
    int sent_bytes = send(socketData->client_socket, output.c_str(), output.size(), 0);
    if (sent_bytes < 0) {
        throw runtime_error("Error writing to socket");
    }
}

