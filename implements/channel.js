// TODO: used to set up a channel
var net = require('net'),
    fs=require('fs'),
    os = require('os'),
    uuid = require('node-uuid'),
    crypto = require('crypto'),
    shasum = crypto.createHash('sha1'),
    noop = function() {},
    localServName = shasum.update(new Date() + 'servPath').digest('hex'),
    localServPath = os.tmpdir() + '/' + localServName + '.sock',
    localServ = null,

    monitor=require('./monitor.js');

    dt = require('../../datatransfer/interface/proxy.js').getProxy(),

    peddingChannel = [],
    runningChannel = []/* , */
    // channels = [
      // 'mouse': [],
      // 'keyboard': [],
      // 'camera': []
    /* ] */;

function channel2MouseKey(callback) {
  // TODO: new a process and pipe to this process
  console.log('channel2MouseKey')
  monitor.monitorPipe(callback
    // function(err,channelTmp){
    //   channelTmp.on('data',function(data){
    //     console.log(data.toString())
    //   });
  //}
  );
  //return callback(null);
}

function channel2Keyboard(callback) {
  // TODO: new a process and pipe to this process
  return callback(null);
}

function channel2Camera(callback) {
  // TODO: new a process and pipe to this process
  return callback(null);
}

function channelEstablish(srcObj, callback) {
  var cb = callback || noop;
  switch(srcObj.type) {
    case 'mouseKey':
      return channel2MouseKey(cb);
    case 'keyboard':
      return channel2Keyboard(cb);
    case 'camera':
      return channel2Camera(cb);
    default:
      return cb('Device type not supported!');
  }
}

function bindChannel(srcObj, channel, callback) {
  var cb = callback || noop;
  channelEstablish(srcObj, function(err, devChannel) {
    console.log('establish----');
     //devChannel.pipe(channel);
     // if(!err){
     //  devChannel.on('data',function(data){
     //    console.log(data.toString())
     //  });
     // }
     peddingChannel[channel.id] = [devChannel, channel];
  });
 /* 
  // Just for test
  var fs = require('fs');
  var rs1 = fs.createReadStream('/home/yff/ttt');
  peddingChannel[channel.id] = [rs1, channel];
  // test end
  */
  return cb(null);
}

function activePeddingChannel(channelID) {
  if(peddingChannel[channelID]) {
    channel = peddingChannel[channelID];
    channel[0].on('data', function(chuck) { 
      //console.log(chuck + '');
      channel[1].write(chuck);
    }).on('error', function(err) {
      console.log(err);
    }); 
    // channel[0].pipe(channel[1]);
    peddingChannel[channelID] = null;
    delete peddingChannel[channelID];
    runningChannel[channelID] = channel;
  } else {
    console.log('peddingChannel not found');
  }
}

exports.localServStart = function(callback) {
  var cb = callback || noop;
  if(localServ == null) {
    localServ = net.createServer(function(channel) {
      channel.id = uuid.v1();
      var protoMgr = function(chuck) {
        var msg = (chuck + '').split(':');
        console.log('message recived:', msg);
        if(msg[0] == '0') {
          // bind request from data consumer
          bindChannel(msg[1], channel, function(err) {
            if(err) return channel.write('0:Error-' + err);
            channel.write('0:OK:' + channel.id);
          });
        } else if(msg[0] == '1') {
          // bind request from data producter
        } else {
          if(msg[0] == channel.id) {
            channel.removeListener('data', protoMgr);
            activePeddingChannel(channel.id);
          }
        }
      }
      channel.on('data', protoMgr);
    });
    localServ.listen(localServPath, function() {
      console.log('Data channel is listening on ' + localServPath);
    });
  }
  cb(null);
}

exports.getChannel = function(srcObj, auth, callback) {
  // TODO: check the authentication
  var cb = callback || noop;
  if(srcObj.srcAddr) {
    // call from remote
    dt.getChannel({addr: srcObj.srcAddr}, function(err, channel) {
      if(err) return callback(err);
      bindChannel(srcObj, channel, function(err) {
        console.log('here  am i');
        if(err) return callback(err);
        callback(null, channel.id);
        channel.once('data', function(chuck) {
          var msg = chuck + '';
          if(channel.id == msg)
            activePeddingChannel(channel.id);
        });
      });
    });
  } else {
    cb(null, localServPath);
  }
}

exports.releaseChannel = function(channelId, auth, callback) {
  // TODO: check the authentication
  console.log('releaseChannel---66');
  var cb = callback || noop;
  try{
    curChannel=runningChannel[channelId];
    if(curChannel!=null){
      console.log('releaseChannel---66'+channelId);
      curChannel[0].destroy();
      curChannel[1].destroy();
      monitor.monitorCancel(function(err_){
        console.log('cancel rst  '+err_);
        cb(err_,channelId);
      });
    }else return cb('can not find the channel',channelId);
  }catch(e){
    cb(e,channelId);
  }
}
