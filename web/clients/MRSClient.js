const net = require('net');

class MRSClient {
    constructor() {
        this.client = new net.Socket();
        this.connected = false;
    }

    connect(host, port) {
        return new Promise((resolve, reject) => {
            this.client.connect(port, host, () => {
                this.connected = true;
                resolve();
            });

            this.client.on('error', (err) => {
                reject(`Connection error: ${err.message}`);
            });

            this.client.on('close', (hadError) => {
                this.connected = false;
                if (!hadError) {
                    reject('Connection closed unexpectedly.');
                }
            });
        });
    }

    disconnect() {
        return new Promise((resolve) => {
            if (this.connected) {
                this.client.destroy();
                this.connected = false;
                resolve();
            } else {
                resolve();
            }
        });
    }

    sendMessage(message) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                return reject('Not connected to the server.');
            }

            this.client.write(message);

            this.client.on('data', (data) => {
                resolve(data.toString());
            });
        });
    }
}

module.exports = MRSClient;