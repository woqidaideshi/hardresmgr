import otherTest
import simulate
if __name__=="__main__":
	def callback(event):
    		print event
	pair=(1,"ho")
	MAP={"pair":str(pair),"key":1}
	print MAP["pair"][1]
	print pair[1]
	test={'ok':'ok','well':'well'};
	print test.__str__().ljust(50)+"000"
	otherTest.run(callback);
	testStr='hi:'+str(1)
	print testStr
	map={};
	map['hi']='hi'
	map['hello']='hello'
	print map
	print map['hi']
	dat="{type:mouse,xPos: 1430,yPos: 411,Obj:0,Action:move,MessageName:mouse 0 move}"
	print sub(dat,1,len(data)-1
