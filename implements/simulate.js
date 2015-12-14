var exec = require('child_process').exec,
config=require('systemconfig');

function simulateMouseKey(data) {
  var dataItems = data.split('\n');
   // exec(
   //      'python /home/fyf/dde/service/hardresmgr/implements/pyxhook/simulate.py '+data),
   //      null);
  // console.log(data);
  // var item=dataItems[dataItems.length-3];
  // console.log('item:'+item)
  // if (item.indexOf('{') >=0){
  //   var ite=item.substr(item.indexOf('{')+1,item.indexOf('}')-1)
  //   exec(
  //       'python /home/fyf/dde/service/hardresmgr/implements/pyxhook/simulate.py '+ite,
  //       null);
  // }
  for (var i=0;i<dataItems.length;i++) {
    var item=dataItems[i];
    if (item.indexOf('{') >=0) {
      var ii=item.substr(item.indexOf('{')+1,item.indexOf('}')-1);
      //console.log(ii)
      exec(
        'python'+config.curDir+' /service/hardresmgr/implements/pyxhook/simulate.py '+ii,
        null);
    }
  }
}
exports.simulateMouseKey = simulateMouseKey;

 var test="{type:mouse,xPos:0,yPos:0,Obj:0,Action:move}";
simulateMouseKey(test);