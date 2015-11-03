var str="{well}\n{hi}";
console.log(str.substr(str.indexOf('{'),str.indexOf('}')))
var strs=str.split('\n');
console.log(strs);
var test={'Action': (0, 'move'), 'Position': (714, 736), 'MessageName': 'mouse 0 move'};
console.log(JSON.stringify(test));
var varStr='{type:mouse,xPos: 587,yPos: 852,Action:move,MessageName:mouse 0 move}';
var json=JSON.parse(varStr);
console.log(json);