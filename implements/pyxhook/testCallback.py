import eventInfo
import time
if __name__=="__main__":
    def callback(event):
       print event
    eventInfo.run(callback)
    #while True:
    # print "ok"