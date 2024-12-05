#include "Server.h"

Server::Server(IMenu *menu, map<string, ICommand *> &commands) : menu(menu), commands(commands) {}

void Server::run() {
    const int server_port = 12345;

    // Create a socket, AF_INET is the address family for IPv4 and SOCK_STREAM is the socket type for TCP
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
    }

    // Set the address to bind to
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(server_port);

    // Bind the socket to the address
    if (bind(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error binding socket");
        return;
    }

    // Listen to the socket connections
    if (listen(sock, 5) < 0) {
        perror("error listening to a socket");
    }

    cout << "Listening..." << endl;
    while (true) {
        auto* socketData = new SocketData();

        // Accept a connection
        socketData->client_socket = accept(sock,
                                           (struct sockaddr *) &socketData->from,
                                           &socketData->from_len);
        if (socketData->client_socket < 0) {
            perror("error accepting connection");
            break;
        }

        // Create a new thread to handle the client
        cout << socketData->client_socket << ":New connection!" << endl;
        thread([socketData]() {
            handleClient(socketData);
        }).detach(); // Automatically cleans up thread resources
    }
    close(sock);
}


void Server::handleClient(void *socketData) {
    auto* data = (SocketData*) socketData;

    while (true) {
        // Clear the buffer for each iteration
        memset(data->buffer, 0, sizeof(data->buffer));

        // Read from the client
        int bytes = recv(data->client_socket,
                         data->buffer,
                         sizeof(data->buffer),
                         0);
        if (bytes < 0) {
            perror("Error reading from socket");
            break;
        } else if (bytes == 0) {
            // Connection closed by the client
            cout << data->client_socket << ":Client disconnected." << endl;
            break;
        }

        cout << data->client_socket << ":The client sent: " << data->buffer << endl;
        int sent_bytes = send(data->client_socket,
                              data->buffer,
                              bytes,
                              0);
        if (sent_bytes < 0) {
            perror("Error writing to socket");
        }
    }

    // Close the client socket and free memory
    close(data->client_socket);
    delete data;
}
