var resourceMgr = require('api').resourceMgr();
var args = {};
var type = [];
type.push('hardResource');
type.push('input');
type.push('mouse');
args['type'] = type;
args['desc'] = {};
args['desc']['IP'] = '127.0.0.1';
var resMgr = null;
resMgr = resourceMgr.getResMgr();
resMgr.on('hardResource', function(rst_) {
  console.log('chag====>' + JSON.stringify(rst_));
  console.log('TIME--->' + new Date().getTime());
});
resMgr.getResourceList(function(err, ret_) {
  console.log("-------------->>>>>>>> " + JSON.stringify(ret_));
  resMgr.applyVideoChat(function(err, ret_) {
    console.log("APLLY VI====================> " + err + "   " + JSON.stringify(ret_));
    console.log('TIME--->' + new Date().getTime());
  }, args);
  var agrsObj = {};
  agrsObj['desc'] = {};
  agrsObj['type'] = ['hardResource'];
  var detail = [];
  var typeItem = {};
  var type = [];
  type.push('input');
  type.push('camera');
  typeItem['type'] = type;
  typeItem['option'] = 0;
  detail.push(typeItem);
  typeItem = {};
  type = [];
  type.push('output');
  type.push('audio');
  typeItem['type'] = type;
  typeItem['option'] = 0;
  detail.push(typeItem);
  typeItem = {};
  type = [];
  type.push('output');
  type.push('video');
  typeItem['type'] = type;
  typeItem['option'] = 0;
  detail.push(typeItem);
  agrsObj['detail'] = detail;
  agrsObj['desc'] = {};
  agrsObj['other'] = 0;
  agrsObj['desc']['IP'] = '127.0.0.1';
  resMgr.releaseResource(function(err, ret_) {
    console.log("RELEASE======000==============> " + err + "   " + JSON.stringify(ret_));
  }, agrsObj);
  resMgr.applyResource(function(err, ret_) {
    console.log("APPLY0====================> " + err + "   " + JSON.stringify(ret_));
    console.log('APPLY0 TIME--->' + new Date().getTime());
    resMgr.getResourceList(function(err, ret_) {
      console.log("GET-------------->>>>>>>> " + JSON.stringify(ret_));
      resMgr.releaseResource(function(err, ret_) {
        console.log("RELEASE====================> " + err + "   " + JSON.stringify(ret_));
        resMgr.getResourceList(function(err, ret_) {
          console.log("GET-------------->>>>>>>> " + JSON.stringify(ret_));
        }, args);
      }, agrsObj);
    }, args);
  }, agrsObj);
  resMgr.releaseResource(function(err, ret_) {
    console.log("RELEASE======111==============> " + err + "   " + JSON.stringify(ret_));
  }, agrsObj);
  var agrsObj1 = {};
  agrsObj1['desc'] = {};
  agrsObj1['type'] = ['hardResource'];
  var detail1 = [];
  var typeItem1 = {};
  var type1 = [];
  type1.push('input');
  type1.push('camera');
  typeItem1['type'] = type;
  typeItem1['option'] = 0;
  detail1.push(typeItem);
  typeItem1 = {};
  type1 = [];
  type1.push('output');
  type1.push('audio');
  typeItem1['type'] = type;
  typeItem1['option'] = 0;
  detail1.push(typeItem);
  typeItem1 = {};
  type1 = [];
  type1.push('output');
  type1.push('video');
  typeItem1['type'] = type;
  typeItem1['option'] = 0;
  detail1.push(typeItem);
  agrsObj1['detail'] = detail;
  agrsObj1['desc'] = {};
  agrsObj1['other'] = 1;
  resMgr.applyResource(function(err, ret_) {
    console.log("APPLY1====================> " + err + "   " + JSON.stringify(ret_));
    console.log('APPLY1 TIME--->' + new Date().getTime());
  }, agrsObj1);
  var agrsObj2 = {};
  agrsObj2['desc'] = {};
  agrsObj2['type'] = ['hardResource'];
  var detail2 = [];
  var typeItem2 = {};
  var type2 = [];
  type2.push('input');
  type2.push('camera');
  typeItem2['type'] = type;
  typeItem2['option'] = 0;
  detail2.push(typeItem);
  typeItem2 = {};
  type2 = [];
  type2.push('output');
  type2.push('audio');
  typeItem2['type'] = type;
  typeItem2['option'] = 0;
  detail2.push(typeItem);
  typeItem2 = {};
  type2 = [];
  type2.push('output');
  type2.push('video');
  typeItem2['type'] = type;
  typeItem2['option'] = 0;
  detail2.push(typeItem);
  agrsObj2['detail'] = detail;
  agrsObj2['desc'] = {};
  agrsObj2['other'] = 2;
  setTimeout(function() {
    resMgr.applyResource(function(err, ret_) {
      console.log("APPLY2====================> " + err + "   " + JSON.stringify(ret_));
      console.log('APPLY2 TIME--->' + new Date().getTime());
    }, agrsObj2);
  }, 1000);
}, args);