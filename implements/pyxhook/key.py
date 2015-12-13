import sys
import virtkey
import time
def simulateEvent(event):
  KeyPressed=event["KeyPressed"]
  AsciiValue=event["AsciiValue"]
  KeyID=event["KeyID"]
  ScanCode=event["ScanCode"]
  Action =event["Action"]
  MessageName=event["MessageName"]
  #print MessageName
  v = virtkey.virtkey()
  if Action == "down":
    v.press_keysym(int(AsciiValue))
  elif Action == "up":
    v.release_keysym(int(AsciiValue))
  else:
    pass
    #print "what are you doing!!!"
if __name__ == '__main__':
    v = virtkey.virtkey()
    ev=sys.argv[1]
    keyAscci=sys.argv[2]
    if ev == "down":
      v.press_keysym(int(keyAscci))
    elif ev == "up":
      v.release_keysym(int(keyAscci))
    else:
      pass
      #print "what are you doing!!!"
    #v.release_keysym(int(keyAscci))