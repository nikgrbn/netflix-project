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
        // Accept a client connection
        struct sockaddr_in client_sin{};
        unsigned int addr_len = sizeof(client_sin);
        int client_sock = accept(sock,  (struct sockaddr *) &client_sin,  &addr_len);

        // Check if the client_sock is valid
        if (client_sock < 0) {
            perror("error accepting client");
        }

        // Handle the client
        handleClient(client_sock);
    }
    close(sock);
}


void Server::handleClient(int client_sock) {
    cout << "Client accepted" << endl;
    while (true) {
        char buffer[4096];
        int expected_data_len = sizeof(buffer);
        int read_bytes = recv(client_sock, buffer, expected_data_len, 0);
        if (read_bytes == 0) {
            // connection is closed
            close(client_sock);
            return;
        }
        else if (read_bytes < 0) {
            // error
            close(client_sock);
            return;
        }
        else {
            buffer[read_bytes] = '\0'; // Null-terminate
            cout << buffer << endl; // Add endl to flush output
        }

        int sent_bytes = send(client_sock, buffer, read_bytes, 0);

        if (sent_bytes < 0) {
            perror("error sending to client");
            close(client_sock);
            return;
        }
    }
}

