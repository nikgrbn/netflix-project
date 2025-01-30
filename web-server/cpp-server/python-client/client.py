import socket
import sys

# Check if the user has provided the destination IP and port
try:
    dest_ip = sys.argv[1]
    dest_port = int(sys.argv[2])
except:
    exit('Usage: python client.py <dest_ip> <dest_port>')

# Create a socket and connect to the server
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((dest_ip, dest_port))

# Send and receive messages
msg = input()
while not msg == 'quit':
    if msg: # If message is not empty
        s.send(bytes(msg, 'utf-8'))
        data = s.recv(4096)
        print(data.decode('utf-8'))
    msg = input()

s.close()

