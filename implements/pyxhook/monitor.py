import eventInfo
if __name__=="__main__":
  def callback(event):
    print event.__str__()#.ljust(204800)
  eventInfo.run(callback)