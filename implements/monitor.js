var spawn = require('child_process').spawn,
  fs = require('fs'),
  stream=require('stream'),
  liner = require('./spwanLiner');

var Writable = stream.Writable;
var curDir= process.cwd();

//var spawn = require('child_process').spawnSync;
//free = spawn('python',['./pyxhook-master/testCallback.py']); 


function monitorFunc(callback) {
  ///home/yff/dde/servihce/hardresmgr/implements/pyxhook
  //free = spawn('python',['./pyxhook/monitor.py']); 
  free = spawn('python', [curDir+'/pyxhook/monitor.py']);
  // 捕获标准输出并将其打印到控制台 
  free.stdout.on('data', function(data) {
    //var rst=(''+data+'').replace(/(^\s*)|(\s*$)/g, "");
    callback(null, data);
  });

  // 捕获标准错误输出并将其打印到控制台 
  free.stderr.on('data', function(data) {
    // console.log('standard error output:\n' + data); 
    //var rst=(''+data+'').replace(/(^\s*)|(\s*$)/g, "");
    callback(true, data);
  });

  // 注册子进程关闭事件 
  free.on('exit', function(code, signal) {
    //console.log('child process exit ,exit:' + code); 
    //var rst=(''+data+'').replace(/(^\s*)|(\s*$)/g, "");
    callback(true, signal);
  });
}

function monitorPipe(callback) {
  free = spawn('python', [curDir+'/pyxhook/monitor.py'],{ stdio: ['pipe', 'pipe', 'pipe'] });
  return callback(null,free.stdout);
  // free.stdout.on('data', function(data) {
  //   //var rst=(''+data+'').replace(/(^\s*)|(\s*$)/g, "");
  //   console.log(data.toString());
  // });
  // 捕获标准错误输出并将其打印到控制台 
  /*free.stderr.on('data', function(data) {
    // console.log('standard error output:\n' + data); 
    //var rst=(''+data+'').replace(/(^\s*)|(\s*$)/g, "");
    //callback(true,data);
    console.log(data);
  });

  // 注册子进程关闭事件 
  free.on('exit', function(code, signal) {
    //console.log('child process exit ,exit:' + code); 
    //var rst=(''+data+'').replace(/(^\s*)|(\s*$)/g, "");
    //callback(true,signal);
    console.log(signal);
  });*/
}
exports.monitorPipe=monitorPipe;

function monitor(callback) {
  console.log('-----');
  var write = new Writable();
  write._write = function (chunk, enc, next) {
    next();
};
  monitorFunc(function(err, data) {
    if (err) {
      console.log('err:' + data);
      callback(err, data);
    } else {
      var rst = ('' + data + '').replace(/(^\s*)|(\s*$)/g, "");
      var str = rst.substr(rst.indexOf('{') + 1, rst.indexOf('}') - 1);
      if (str.length > 8) {
        write.write(str);
        //console.log(str);
        //callback(err, str);
      }
      callback(null,write);
    }
  });
}
exports.monitor = monitor;

// monitorPipe(function(err,channel){
//   if(!err){ 
//     channel.on('data',function(data){
//       var dataItems = data.toString();
//       var lines = dataItems.split('\n')
//       for(var i=0;i<lines.length;i++){
//         console.log(lines[i])
//       }
//     });
//   }
// });


//monitorPipe(function(){});
