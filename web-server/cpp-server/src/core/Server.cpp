#include "core/Server.h"

Server::Server(map<string, ICommand *> &commands, int server_port) :
    commands(commands), server_port(server_port), pool(4) {}

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
    cout << "Server is running on port " << server_port << endl;

    while (true) {
        // Create a unique_ptr for socket data to manage memory
        auto socketData = make_shared<SocketData>(); // new SocketData();

        // Accept a connection
        socketData->client_socket = accept(serverSock.get(),
                                           reinterpret_cast<struct sockaddr*>(&socketData->from),
                                           &socketData->from_len);
        if (socketData->client_socket < 0) {
            perror("Error accepting connection");
            break;
        }


        // Enqueue client handling task
        cout << socketData->client_socket << ":New connection" << endl;
        pool.enqueue([this, socketData]() mutable {
            handleClient(socketData);
        });
    }
}


void Server::handleClient(std::shared_ptr<SocketData> data) {
    // Use RAII for client socket
    SocketRAII clientSock(data->client_socket);

    // Use unique_ptr for menu to manage memory
    auto menu = make_unique<SocketMenu>(std::move(data));

    while (true) {
        try {
            // Get the next command from the client
            vector<string> args = menu->nextCommand();

            // Check if command exists
            if (args.empty()) {
                throw StatusCodeException(StatusCodes::BAD_REQUEST);
            }
            auto it = commands.find(args[0]);
            if (it == commands.end() || !(it->second)) {
                throw StatusCodeException(StatusCodes::BAD_REQUEST);
            }

            // Lock the mutex before executing the command
            string res = it->second->execute(args);

            if (!res.empty()) {
                menu->out(res);
            } else {
                menu->out(StatusCodes::NO_CONTENT);
            }

        } catch (const StatusCodeException& e) {
            // Send the status code message to the client
            menu->out(e.what());
            continue;

        } catch (const std::exception& e) {
            // Close the connection
            cout << clientSock.get() << ":" << e.what() << endl;
            break;
        }
    }
}