// This file is auto generated based on user-defined interface.
// Please make sure that you have checked all TODOs in this file.
// TODO: please replace types with peramters' name you wanted of any functions
// TODO: please replace $ipcType with one of dbus, binder, websocket and socket

var channel = require('../implements/channel');
var initObj = {
  "address": "nodejs.webde.hardresmgr",
  "path": "/nodejs/webde/hardresmgr",
  "name": "nodejs.webde.hardresmgr",
  "type": "dbus",
  "service": true,
  "interface": [
    {
      "name": "getResourceList",
      "in": [
        "Object"
      ]
    },
    {
      "name": "getCateList",
      "in": [
        "Object"
      ]
    },
    {
      "name": "applyResource",
      "in": [
        "Object"
      ]
    },
    {
      "name": "releaseResource",
      "in": [
        "Object"
      ]
    },
    {
      "name": "getChannel",
      "in": [
        "Object",
        "String"
      ]
    }
  ],
  "serviceObj": {
    getResourceList: function(Object, callback) {
      hardResMgr.getResourceList(Object,function(err,result){
        if (err) return callback({err: err});
        console.log(JSON.stringify(result))
        callback({ret: result});
      });
    },
    getCateList: function(Object, callback) {
      hardResMgr.getCateList(Object,function(err,result){
        if (err) return callback({err: err});
        callback({ret: result});
      });
    },
    applyResource: function(Object, callback) {
      applyQueue.push([Object,callback]);
      if(applyQueue.length===1)
        stub._handleApplyQueue();
    },
    releaseResource: function(Object, callback) {
      releaseQueue.push([Object,callback]);
      if(releaseQueue.length===1)
        stub._handleReleaseQueue();
    },
    getChannel: function(srcObj, auth, callback) {
      channel.getChannel(srcObj, auth, function(err,data) {
        console.log('----getChannel');
        if(err) return callback({err: err});
        callback({ret: arguments[1]});
      });
    }
  }
}

function Stub() {
  // TODO: please replace $IPC with the real path of webde-rpc module in your project
  this._ipc = require('webde-rpc').getIPC(initObj);
}

Stub.prototype.notify = function(event) {
  this._ipc.notify.apply(this._ipc, arguments);
};

Stub.prototype._notifyStateChg = function(items_, state_) {
  try {
    var detail=items_['detail'];
    for (var i=0;i< detail.length;i++) {
      var item =detail[i];
      if (item['option'] !== undefined) delete item['option'];
      item['state'] = state_;
    }
    stub.notify('stateChange',items_);
  } catch (e) {
    console.log('state changed notify fail');
  }
};
Stub.prototype._handleApplyQueue = function() {
  flowctl.series([{
    fn: function(pera_, cb_) {
      var ctn = applyQueue[0];
      hardResMgr.applyResource(ctn[0], function(err, result) {
        if (err) ctn[1]({err: err});
        else {
          stub._notifyStateChg(result, '1');
          ctn[1]({ret: result});
        }
        cb_();
      });
    },
    pera: {}
  }], function(err_, rets_) {
    applyQueue.shift();
    if (applyQueue.length != 0)
      stub._handleApplyQueue();
  });
};
Stub.prototype._handleReleaseQueue = function() {
  flowctl.series([{
    fn: function(pera_, cb_) {
      var ctn = releaseQueue[0];
      hardResMgr.releaseResource(ctn[0], function(err, result) {
        if (err) ctn[1]({err: err});
        else {
          ctn[1]({ret: result});
          stub._notifyStateChg(result, '0');
        }
        cb_();
      });
    },
    pera: {}
  }], function(err_, rets_) {
    releaseQueue.shift();
    if (releaseQueue.length != 0)
      stub._handleReleaseQueue();
  });
};

var utils = require('utils'),
  flowctl = utils.Flowctl();
var stub = null,
    cd = null,
    hardResMgr = null;
var applyQueue = [],
    releaseQueue = [];
exports.getStub = function(hardResMgr_) {
  if(stub == null) {
    stub = new Stub();
    hardResMgr = hardResMgr_;
  }
  return stub;
}
