import socket

def sendInfo(data):
  HOST, PORT = "192.168.160.18", 9999
  # Create a socket (SOCK_STREAM means a TCP socket)
  #sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

  try:
          # Connect to server and send data
          #sock.connect((HOST, PORT))
          #sock.sendall(data)
          sock.sendto(data,("192.168.160.18", 9999))

          # Receive data from the server and shut down
          #received = sock.recv(1024)
  finally:
          sock.close()

  print "Sent:     {}".format(data)
  #print "Received: {}".format(received)