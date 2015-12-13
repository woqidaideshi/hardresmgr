// This file is auto generated based on user-defined interface.
// Please make sure that you have checked all TODOs in this file.
// TODO: please replace types with peramters' name you wanted of any functions
// TODO: please replace $ipcType with one of dbus, binder, websocket and socket

var __cd = undefined,
    init = false,
    pending = [];
require('webde-rpc').defaultSvcMgr().getService('nodejs.webde.commdaemon', function(ret) {
  if(ret.err) return console.log(ret.err);
  __cd = ret.ret;
  init = true;
  __emit();
});

function __emit() {
  for(var key in pending) {
    for(var i = 0; i < pending[key].length; ++i) {
      var p = pending[key][i];
      clearTimeout(p[1]);
      proxy[key].apply(proxy, p[0]);
    }
  }
  pending = [];
}

function __pend(fn, args, cb) {
  if(typeof pending[fn] === 'undefined') {
    pending[fn] = [];
  }
  var to = setTimeout(function() {
    cb({err: 'Can\'t get commdaemon service'});
  }, 5000);
  pending[fn].push([args, to]);
}

function Proxy(ip) {
  if(typeof ip !== 'undefined') {
    this.ip = ip;
  } else {
    return console.log('The remote IP is required');
  }

  this._token = 0;

}

/**
 * @description
 *    some brief introduction of this interface
 * @param
 *    parameter list. e.g. param1: description -> value type
 * @return
 *    what will return from this interface
 */
Proxy.prototype.getResourceList = function(Object, callback) {
  if(!init) {
    __pend('getResourceList', arguments, callback);
    return ;
  }
  var l = arguments.length,
      args = Array.prototype.slice.call(arguments, 0, (typeof callback === 'undefined' ? l : l - 1));
  var argv = {
      action: 0,
      svr: 'nodejs.webde.hardresmgr',
      func: 'getResourceList',
      args: args
    };
  __cd.send(this.ip, argv, callback);
};

/**
 * @description
 *    some brief introduction of this interface
 * @param
 *    parameter list. e.g. param1: description -> value type
 * @return
 *    what will return from this interface
 */
 Proxy.prototype.getCateList = function(Object, callback) {
  if(!init) {
    __pend('getCateList', arguments, callback);
    return ;
  }
  var l = arguments.length,
      args = Array.prototype.slice.call(arguments, 0, (typeof callback === 'undefined' ? l : l - 1));
  var argv = {
      action: 0,
      svr: 'nodejs.webde.hardresmgr',
      func: 'getCateList',
      args: args
    };
  __cd.send(this.ip, argv, callback);
};

/**
 * @description
 *    some brief introduction of this interface
 * @param
 *    parameter list. e.g. param1: description -> value type
 * @return
 *    what will return from this interface
 */
Proxy.prototype.applyResource = function(Object, callback) {
  if(!init) {
    __pend('applyResource', arguments, callback);
    return ;
  }
  var l = arguments.length,
      args = Array.prototype.slice.call(arguments, 0, (typeof callback === 'undefined' ? l : l - 1));
  var argv = {
      action: 0,
      svr: 'nodejs.webde.hardresmgr',
      func: 'applyResource',
      args: args
    };
  __cd.send(this.ip, argv, callback);
};

/**
 * @description
 *    some brief introduction of this interface
 * @param
 *    parameter list. e.g. param1: description -> value type
 * @return
 *    what will return from this interface
 */
Proxy.prototype.releaseResource = function(Object, callback) {
  if(!init) {
    __pend('releaseResource', arguments, callback);
    return ;
  }
  var l = arguments.length,
      args = Array.prototype.slice.call(arguments, 0, (typeof callback === 'undefined' ? l : l - 1));
  var argv = {
      action: 0,
      svr: 'nodejs.webde.hardresmgr',
      func: 'releaseResource',
      args: args
    };
  __cd.send(this.ip, argv, callback);
};

var dt = require('../../datatransfer/interface/proxy.js').getProxy(),
    os = require('os'),
    netIface = os.networkInterfaces(),
    eth = netIface.eth0 || netIface.eth1,
    localIP = eth[0].address;
/**
 * @description
 *    Set up a data channel based on data type and authentication
 * @param
 *    param1: {
 *      type: device type,
 *      cmd: process to capture devices, default is undefined
 *      arg: arguments for cmd, only when cmd is not undefined
 *    } -> Object
 *    param2: authentication recived -> String
 *    param3: callback function -> Function
 *    @description
 *      return the result of this RPC call
 *    @param
 *      param1: err description or null
 *      param2: data channel object
 * @return
 *    err or data channel object
 */
Proxy.prototype.getChannel = function(Object, String, callback) {
  if(!init) {
    __pend('getChannel', arguments, callback);
    return ;
  }
  var l = arguments.length,
      args = Array.prototype.slice.call(arguments, 0, (typeof callback === 'undefined' ? l : l - 1)),
      cb = function(ret) {
        console.log('remote getChannel back!!', ret);
        if(ret.err) return callback(ret.err);
        var sessionID = ret.ret;
        dt.getChannel({sessionID: sessionID}, function(err, dChannel) {
          console.log('hi=====hi');
          if(err) return callback(err);
          callback(null, dChannel);
          // if(!err){
          //   dChannel.on('data',function(data){
          //     console.log(data.toString())
          //   });
          // }
          dChannel.write(dChannel.id);
        });
      };
  args[0].srcAddr = localIP;
  var argv = {
        action: 0,
        svr: 'nodejs.webde.hardresmgr',
        func: 'getChannel',
        args: args
      };
  __cd.send(this.ip, argv, callback);
  console.log('remote proxy:', args);
};

/**
 * @description
 *    add listener for ...
 * @param
 *    param1: event to listen -> String
 *    param2: a listener function -> Function
 *      @description
 *        a callback function called when events happened
 *      @param
 *        param1: description of this parameter -> type
 * @return
 *    itself of this instance
 */
Proxy.prototype.on = function(event, handler) {
  if(!init) {
    __pend('on', arguments, function(){});
    return ;
  }
  __cd.on(event, handler);
  var argvs = {
    'action': 0,
    'svr': 'nodejs.webde.hardresmgr',
    'func': 'on',
    'args': [event]
  };
  __cd.send(this.ip, argvs);
  return this;
};

/**
 * @description
 *    remove listener from ...
 * @param
 *    param1: event to listen -> String
 *    param2: a listener function -> Function
 *      @description
 *        a callback function called when events happened
 *      @param
 *        param1: description of this parameter -> type
 * @return
 *    itself of this instance
 */
Proxy.prototype.off = function(event, handler) {
  if(!init) {
    __pend('off', arguments, function(){});
    return ;
  }
  __cd.off(event, handler);
  var argvs = {
    'action': 0,
    'svr': 'nodejs.webde.hardresmgr',
    'func': 'off',
    'args': [event]
  };
  __cd.send(this.ip, argvs);
  return this;
};

var proxy = null;
exports.getProxy = function(ip) {
  if(proxy == null) {
    proxy = new Proxy(ip);
  }
  return proxy;
};
