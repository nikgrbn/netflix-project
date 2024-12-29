const net = require('net');
const { errors } = require('../utils/consts');
require('dotenv').config();

class MRSClient {
    constructor() {
        this.client = new net.Socket();
        this.connected = false;
    }

    connect() {
        return new Promise((resolve, reject) => {
            const host = process.env.MRS_IP;
            const port = process.env.MRS_PORT;

            this.client.connect(port, host, () => {
                this.connected = true;
                resolve();
            });

            this.client.on('error', (err) => {
                reject(errors.MRS_CONNECTION_ERROR);
            });

            this.client.on('close', (hadError) => {
                this.connected = false;
                if (!hadError) {
                    reject(errors.MRS_CONNECTION_CLOSED);
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
                return reject(errors.MRS_NOT_CONNECTED);
            }

            this.client.write(message);

            this.client.on('data', (data) => {
                resolve(data.toString());
            });
        });
    }
}

const codes = {
    OK: "200 Ok",
    CREATED: "201 Created",
    NO_CONTENT: "204 No Content",
    BAD_REQUEST: "400 Bad Request",
    NOT_FOUND: "404 Not Found",
};

module.exports = { MRSClient, codes };
