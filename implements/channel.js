// TODO: used to set up a channel
var net = require('net'),
    os = require('os'),
    crypto = require('crypto'),
    shasum = crypto.createHash('sha1'),
    noop = function() {},
    localServName = shasum.update(new Date() + 'servPath').digest('hex'),
    localServPath = os.tmpdir() + '/' + localServName + '.sock',
    localServ = null;

function bindChannel(type) {
  // TODO: how to manage every channel
  return 'OK';
}

exports.localServStart = function(callback) {
  var cb = callback || noop;
  if(localServ == null) {
    localServ = net.createServer(function(channel) {
      channel.once('data', function(chuck) {
        var msg = (chuck + '').split(':');
        if(msg[0] == '0') {
          var ret = bindChannel(msg[1]);
          channel.send('0:' + ret);
        }
      });
    });
    localServ.listen(localServPath, function() {
      console.log('Data channel is listening on ' + localServPath);
    });
  }
  cb(null);
}

function channel2Mouse(callback) {
  return callback(null);
}

function channel2Keyboard(callback) {
  return callback(null);
}

function channel2Camera(callback) {
  return callback(null);
}

function channelEstablish(type, callback) {
  var cb = callback || noop;
  switch(type) {
    case 'mouse':
      return channel2Mouse(cb);
    case 'keyboard':
      return channel2Keyboard(cb);
    case 'camera':
      return channel2Camera(cb);
    default:
      return cb('Device type not supported!');
  }
}

exports.getChannel = function(type, auth, callback) {
  // TODO: check the authentication
  var cb = callback || noop,
      arg = type.split('_');
  if(arg[1] == 'remote') {
    // call from remote
    channelEstablish(arg[0], function(err, devChannel) {
    });
  } else {
    cb(null, localServPath);
  }
}

