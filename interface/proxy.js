// This file is auto generated based on user-defined interface.
// Please make sure that you have checked all TODOs in this file.
// TODO: please replace types with peramters' name you wanted of any functions
// TODO: please replace $ipcType with one of dbus, binder, websocket and socket

var initObj = {
  "address": "nodejs.webde.hardresmgr",
  "path": "/nodejs/webde/hardresmgr",
  "name": "nodejs.webde.hardresmgr",
  "type": "dbus",
  "service": false
}

function Proxy() {
  // TODO: please replace $IPC with the real path of webde-rpc module in your project
  this._ipc = require('webde-rpc').getIPC(initObj);
  this._token = 0;

  // TODO: choose to implement interfaces of ipc
  /* handle message send from service
  this._ipc.onMsg = function(msg) {
    // TODO: your handler
  }*/

  /* handle the event emitted when connected succeffuly
  this._ipc.onConnect = function() {
    // TODO: your handler
  }*/

  /* handle the event emitted when connection has been closed
  this._ipc.onClose = function() {
    // TODO: your handler
  }*/

  /* handle the event emitted when error occured
  this._ipc.onError = function(err) {
    // TODO: your handler
  }*/
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
  var l = arguments.length,
      args = Array.prototype.slice.call(arguments, 0, (typeof callback === 'undefined' ? l : l - 1));
  this._ipc.invoke({
    token: this._token++,
    name: 'getResourceList',
    in: args,
    callback: callback
  });
};

/**
 * @description
 *    some brief introduction of this interface
 * @param
 *    parameter list. e.g. param1: description -> value type
 * @return
 *    what will return from this interface
 */
// TODO: modify to return an authentication for setting up data channels
Proxy.prototype.applyResource = function(Object, callback) {
  var l = arguments.length,
      args = Array.prototype.slice.call(arguments, 0, (typeof callback === 'undefined' ? l : l - 1));
  this._ipc.invoke({
    token: this._token++,
    name: 'applyResource',
    in: args,
    callback: callback
  });
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
  var l = arguments.length,
      args = Array.prototype.slice.call(arguments, 0, (typeof callback === 'undefined' ? l : l - 1));
  this._ipc.invoke({
    token: this._token++,
    name: 'releaseResource',
    in: args,
    callback: callback
  });
};

var net = require('net');
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
Proxy.prototype.getChannel = function(srcObj, auth, callback) {
  var l = arguments.length,
      args = Array.prototype.slice.call(arguments, 0, (typeof callback === 'undefined' ? l : l - 1)),
      cb = function(ret) {
        console.log('local getChannel back!!', ret);
        if(srcObj.srcAddr) return callback(ret);
        if(ret.err) return callback(ret.err);
        var servPath = ret.ret;
        var channel = net.connect({path: servPath}, function() {
          channel.write('0:' + srcObj.type);
        });
        channel.once('data', function(chuck) {
          var msg = (chuck + '').split(':');
          console.log('message recived:', msg);
          if(msg[0] == '0') {
            if(msg[1] == 'OK') {
              channel.id = msg[2];
              channel.write(channel.id);
              return callback(null, channel);
            } else {
              return callback('Bind channel failed!! ' + msg[1]);
            }
          }
        }).once('error', function(err) {
          callback(err);
        });
      };
  this._ipc.invoke({
    token: this._token++,
    name: 'getChannel',
    in: args,
    callback: cb
  });
  console.log('local proxy:', args);
}

// TODO: add an interface called connChannel(auth, sessionID) for conn self-defined process

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
  this._ipc.on(event, handler);
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
  this._ipc.removeListener(event, handler);
};

var proxy = null;
exports.getProxy = function() {
  if(proxy == null) {
    proxy = new Proxy();
  }
  return proxy;
};
