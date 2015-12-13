var monitor =require('./monitor');

monitor.monitorPipe(function(err,channel){
  if(!err){ 
    channel.on('data',function(data){
      var dataItems = data.toString();
      var lines = dataItems.split('\n')
      for(var i=0;i<lines.length;i++){
        console.log(lines[i])
      }
    });
  }
});
