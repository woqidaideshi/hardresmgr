var spawn = require('child_process').spawn,
  fs = require('fs');
//var spawn = require('child_process').spawnSync;
//free = spawn('python',['./pyxhook-master/testCallback.py']); 


function monitorFunc(callback) {
  ///home/yff/dde/service/hardresmgr/implements/pyxhook
  //free = spawn('python',['./pyxhook/monitor.py']); 
  free = spawn('python', ['/home/fyf/dde/service/hardresmgr/implements/pyxhook/monitor.py']);
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
  free = spawn('python', ['/home/fyf/dde/service/hardresmgr/implements/pyxhook/monitor.py']);
  callback(null,free.stdout);
  // 捕获标准错误输出并将其打印到控制台 
  free.stderr.on('data', function(data) {
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
  });
}
exports.monitorPipe=monitorPipe;

function monitor(callback) {
  console.log('-----')
  monitorFunc(function(err, data) {
    if (err) {
      console.log('err:' + data);
      callback(err, data);
    } else {
      var rst = ('' + data + '').replace(/(^\s*)|(\s*$)/g, "");
      var str = rst.substr(rst.indexOf('{') + 1, rst.indexOf('}') - 1);
      if (str.length > 8) {
        console.log(str);
        callback(err, str);
      }
    }
  });
}
exports.monitor = monitor;

function monitorF() {
  monitorPipe(function(err, channel) {
    var file=fs.createWriteStream('./a.out');
    channel.pipe(file);
  });
}
exports.monitorF = monitorF;
//monitor(function(){});
monitorF();