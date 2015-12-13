/* var proxy = require('../interface/hardresmgrProxy').getProxy(); */

// proxy.getChannel({
    // type: 'mouse',
  // }, 'abcd', function(err, channel) {
  // if(err) return console.log(err);
  // channel.on('data', function(chuck) {
    // console.log(chuck + '');
  // }).on('end', function() {
    // console.log('Over');
  // }).on('error', function(err) {
    // console.log(err);
  // });
// });

var proxy = require('../interface/proxyremote').getProxy('192.168.160.18');

proxy.getChannel({
    type: 'mouse',
  }, 'abcd', function(err, channel) {
  if(err) return console.log(err);
  channel.on('data', function(chuck) {
    console.log('client:', chuck + '');
  }).on('end', function() {
    console.log('Over');
  }).on('error', function(err) {
    console.log(err);
  });
});

