import otherTest
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