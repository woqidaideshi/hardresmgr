var util = require('util');
var resourceMgr = require('api').resourceMgr();
var args = {};
var type = [];
type.push('hardResource');
//type.push('output');
//type.push('vga');
args['type'] = type;
args['desc'] = {};
args['desc']['IP'] = '192.168.160.18';
var resMgr = null;
resMgr = resourceMgr.getResMgr();
resMgr.on('hardResource', function(rst_) {
  console.log('chag====>' + JSON.stringify(rst_));
  console.log('TIME--->' + new Date().getTime());
});
resMgr.getResourceList(function(err, ret_) {
  console.log("-------------->>>>>>>> " + JSON.stringify(ret_));
  // console.log(util.inspect(ret_, {colors:true, depth:10}));
  // var agrsObj = {};
  // agrsObj['desc'] = {};
  // agrsObj['type'] = ['hardResource'];
  // var detail = [];
  // var typeItem = {};
  // var type = [];
  // type.push('input');
  // type.push('camera');
  // typeItem['type'] = type;
  // typeItem['option'] = 0;
  // detail.push(typeItem);
  // typeItem = {};
  // type = [];
  // type.push('output');
  // type.push('audio');
  // typeItem['type'] = type;
  // typeItem['option'] = 0;
  // detail.push(typeItem);
  // typeItem = {};
  // type = [];
  // type.push('output');
  // type.push('video');
  // typeItem['type'] = type;
  // typeItem['option'] = 0;
  // detail.push(typeItem);
  // agrsObj['detail'] = detail;
  // agrsObj['desc'] = {};
  // agrsObj['other'] = 0;
  // agrsObj['desc']['IP'] = '127.0.0.1';
  // resMgr.applyResource(function(err, ret_) {
  //   console.log("APPLY====================> " + err + "   " + JSON.stringify(ret_));
  //   console.log('APPLY TIME--->' + new Date().getTime());
  //   resMgr.getResourceList(function(err, ret_) {
  //     console.log("GET-------------->>>>>>>> " + JSON.stringify(ret_));
  //     resMgr.releaseResource(function(err, ret_) {
  //       console.log("RELEASE====================> " + err + "   " + JSON.stringify(ret_));
  //       resMgr.getResourceList(function(err, ret_) {
  //         console.log("GET-------------->>>>>>>> " + JSON.stringify(ret_));
  //       }, args);
  //     }, agrsObj);
  //   }, args);
  // }, agrsObj);
}, args);