// var str="{well}";
// console.log(str.substr(str.indexOf('{'),str.indexOf('}')))
// var test={'Action': (0, 'move'), 'Position': (714, 736), 'MessageName': 'mouse 0 move'};
// console.log(JSON.stringify(test));
// var stream = require('stream');
// var Readable = require('stream').Readable;

// var rs = new Readable;
// rs.push('beep ');
// rs.push('boop\n');
// //rs.push(null);

// rs.pipe(process.stdout);


// var duplex = new stream.Duplex();

var exec = require('child_process').exec;
exec('df -P | awk \'NR > 1\'', function(err, stdout, stderr) {
  if (err) {
    console.log('disk err---' + err);
    return callback(err);
  }
  var aDrives = [];
  var aLines = stdout.split('\n');
  for (var i = 0; i < aLines.length; i++) {
    var sLine = aLines[i];
    if (sLine != '') {
      var aTokens = sLine.replace(/\s+/g, " ").split(/\s/g);
      aDrives[aDrives.length] = {
        filesystem: aTokens[0],
        totalSize: aTokens[1],
        used: aTokens[2],
        available: aTokens[3],
        capacity: aTokens[4],
        mounted: aTokens[5]
      };
    }
  }
  //console.log(aDrives)
  //callback(null, aDrives);
});

exec(
  'xrandr',
  function(err, stdout, stderr) {
    if (err) console.log('xrandr error' + err);
    else console.log(stdout.replace(/\s+/g, " ").split(/\s/g));
  }
);


sLine = "hi    hi hi";
console.log(sLine.replace(/\s+/g, " "));