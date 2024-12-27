const net = require('net');

async function sendMessageMRS(host, port, message) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        
        // Connect to the server
        client.connect(port, host, () => {
            client.write(message);
        });

        // Handle incoming data
        client.on('data', (data) => {
            resolve(data.toString());
            client.destroy(); // Close the connection after receiving data.
        });

        // Handle connection errors
        client.on('error', (err) => {
            reject(`Connection error: ${err.message}`);
        });
        
        // Handle connection close
        client.on('close', (hadError) => {
            if (!hadError) {
                reject('Connection closed unexpectedly.');
            }
        });
    });
}

module.exports = { sendMessageMRS };
