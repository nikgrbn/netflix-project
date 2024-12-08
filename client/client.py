import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
dest_ip = '127.0.0.1'
dest_port = 12345
s.connect((dest_ip, dest_port))

msg = input()
while not msg == 'quit':
    if msg: # If message is not empty
        s.send(bytes(msg, 'utf-8'))
        data = s.recv(4096)
        print(data.decode('utf-8'))
    msg = input()

s.close()

