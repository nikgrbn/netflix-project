#include "core/Server.h"

Server::Server(map<string, ICommand *> &commands, int server_port) : commands(commands), server_port(server_port) {}

void Server::run() {
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
        return;
    }

    cout << "port: " << server_port << " addr: " << inet_ntoa(sin.sin_addr) << " Listening..." << endl;
    while (true) {
        // Create a unique_ptr for socket data to manage memory
        auto socketData = make_unique<SocketData>(); // new SocketData();

        // Accept a connection
        socketData->client_socket = accept(serverSock.get(),
                                           reinterpret_cast<struct sockaddr*>(&socketData->from),
                                           &socketData->from_len);
        if (socketData->client_socket < 0) {
            perror("Error accepting connection");
            break;
        }

        // Create a new thread to handle the client
        cout << socketData->client_socket << ":New connection!" << endl;
        thread([this, socketData = std::move(socketData)]() {
            handleClient(socketData.get());
        }).detach(); // Automatically cleans up thread resources
    }
}


void Server::handleClient(SocketData* data) {
    // Use RAII for client socket
    SocketRAII clientSock(data->client_socket);

    // Use unique_ptr for menu to manage memory
    auto menu = make_unique<SocketMenu>(data);

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
                throw StatusCodeException(StatusCodes::BAD_REQUEST);
            }

            // Execute the command
            cmdExecMtx.lock();
            string res = it->second->execute(args); // TODO: Mutex here, maybe? What about 'help' or 'recommend' commands? Neither use shared resources - so why lock them with mutex?
            cmdExecMtx.unlock();
            if (!res.empty()) {
                menu->out(res);
            } else {
                menu->out(StatusCodes::NO_CONTENT);
            }

        } catch (const StatusCodeException& e) {
            // Send the error message to the client
            menu->out(e.what());
            continue;

        } catch (const std::exception& e) {
            // Close the connection
            cout << data->client_socket << ":" << e.what() << endl;
            break;
        }
    }
}