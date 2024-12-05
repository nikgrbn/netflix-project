#include "Server.h"

Server::Server(map<string, ICommand *> &commands) : commands(commands) {}

void Server::run() {
    const int server_port = 12345;

    // Create a socket, AF_INET is the address family for IPv4 and SOCK_STREAM is the socket type for TCP
    SocketRAII serverSock(socket(AF_INET, SOCK_STREAM, 0));
    if (serverSock.get() < 0) {
        perror("error creating socket");
        return;
    }

    // Set the address to bind to
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(server_port);

    // Bind the socket to the address
    if (bind(serverSock.get(), (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error binding socket");
        return;
    }

    // Listen to the socket connections
    if (listen(serverSock.get(), 5) < 0) {
        perror("error listening to a socket");
    }

    cout << "Listening..." << endl;
    while (true) {
        // Create a new socket data object
        auto* socketData = new SocketData();

        // Accept a connection
        socketData->client_socket = accept(serverSock.get(),
                             (struct sockaddr *) &socketData->from,
                             &socketData->from_len);
        if (socketData->client_socket < 0) {
            perror("Error accepting connection");
            break;
        }

        // Create a new thread to handle the client
        cout << socketData->client_socket << ":New connection!" << endl;
        thread([this, socketData]() {
            handleClient(socketData);
        }).detach(); // Automatically cleans up thread resources
    }
}


void Server::handleClient(void *socketData) {
    auto* data = (SocketData*) socketData;
    SocketRAII clientSock(data->client_socket);
    auto* menu = new SocketMenu(data);

    while (true) {
        // Clear the buffer for each iteration
        memset(data->buffer, 0, sizeof(data->buffer));
        try {
            // Get the next command from the client
            vector<string> args = menu->nextCommand();

            // TODO: Used for debugging, remove later
            cout << data->client_socket << ":" << "The client sent: ";
            for (const auto& arg : args) {
                cout << arg << " ";
            }
            cout << endl;

            // Check if command exists
            auto it = commands.find(args[0]);
            if (it == commands.end() || !(it->second)) {
                // Skip to the next iteration
                continue;
            }

            // Execute the command
            string res = it->second->execute(args);
            if (!res.empty()) {
                menu->out(res);
            }

        } catch (const std::exception& e) {
            cout << data->client_socket << ":" << e.what() << endl;
            break;
        }
    }

    // Close the client socket and free memory
    delete data;
    delete menu;
}