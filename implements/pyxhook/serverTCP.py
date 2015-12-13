import SocketServer
import json
import mouse
import key

class MyTCPHandler(SocketServer.BaseRequestHandler):
    def handle(self):
        # self.request is the TCP socket connected to the client
        self.data = self.request.recv(1024).strip()
        #print "{} wrote:".format(self.client_address[0])
        #print self.data
        event=json.loads(self.data)
        #print len(event)
        length=len(event)
        if length==3:
            mouse.simulateEvent(event)
        else:
            key.simulateEvent(event)
        # just send back the same data, but upper-cased
        self.request.sendall(self.data.upper())
        

if __name__ == "__main__":
    HOST, PORT = "192.168.160.66", 9999

    # Create the server, binding to localhost on port 9999
    server = SocketServer.TCPServer((HOST, PORT), MyTCPHandler)

    # Activate the server; this will keep running until you
    # interrupt the program with Ctrl-C
    server.serve_forever()    