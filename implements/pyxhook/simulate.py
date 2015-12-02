import sys
import mouse
import key
if __name__ == "__main__":
  data=sys.argv[1].replace(" ", "").split(',')
  mapStr={}
  for i in range(len(data)):
    tmp=data[i].split(':')
    mapStr[tmp[0]]=tmp[1]
  if mapStr['type']=='mouse':
    mouse.simulateEvent(mapStr)
  elif mapStr['type']=='key':
    key.simulateEvent(mapStr)
  '''args=sys.argv[1].split('\n')
  for j in range(len(args)):
    item=args[j]
    if item.indexOf("{")>=0:
      data=item.substr().replace(" ", "").split(',')
      mapStr={}
      for i in range(len(data)):
        tmp=data[i].split(':')
        mapStr[tmp[0]]=tmp[1]
      if mapStr['type']=='mouse':
        mouse.simulateEvent(mapStr)
      elif mapStr['type']=='key':
        key.simulateEvent(mapStr)'''
