var str="{well}";
console.log(str.substr(str.indexOf('{'),str.indexOf('}')))
var test={'Action': (0, 'move'), 'Position': (714, 736), 'MessageName': 'mouse 0 move'};
console.log(JSON.stringify(test));
var stream = require('stream');
var Readable = require('stream').Readable;

var rs = new Readable;
rs.push('beep ');
rs.push('boop\n');
//rs.push(null);

rs.pipe(process.stdout);


var duplex = new stream.Duplex();

