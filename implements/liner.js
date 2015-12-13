var stream = require('stream')
var liner = new stream.Transform( { objectMode: true } )

liner._transform = function (chunk, encoding, done) {
  var rst = chunk.toString().replace(/(^\s*)|(\s*$)/g, "");
  if(rst.indexOf('{')>=0){
    this.push.bind(this);
    this.push(rst);
    //done();
  }
}

liner._flush = function (done) {
     //done()
}
module.exports = liner