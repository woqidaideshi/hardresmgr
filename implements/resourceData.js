var exec = require('child_process').exec,
  utils = require('utils'), 
  printer = require("printer"), 
flowctl = utils.Flowctl(),
json4line = utils.Json4line();

function getPciInfo(callback) {
  var aDrives = [];
  exec(
    'lspci | awk \'NR > 1\'',
    function(err, stdout, stderr) {
      if (err) return callback(err, null);
      var aLines = stdout.split('\n');
      // For each line get drive info and add to array
      for (var i = 0; i < aLines.length; i++) {
        var sLine = aLines[i];
        if (sLine != '') {
          var aTokens = sLine.split(': ');
          aDrives[aDrives.length] = {
            id: aTokens[0].substring(0, 7),
            title: aTokens[0].substring(8),
            content: aTokens[1]
          };
        }
      }
      callback(null, aDrives);
    }
  );
}
exports.getPciInfo = getPciInfo;

function getOutputInfo(container, callback) {
  getPciInfo(function(err, rstArr) {
    if (err) return callback(err);
    for (var key in container) {
      var containerItem = container[key];
      var flag = true;
      for (var i = 0; i < rstArr.length; i++) {
        var itemDetail = rstArr[i];
        var itemDetailTmp = itemDetail['title'].toLowerCase();
        if (itemDetailTmp.indexOf(key) < 0) {
          continue;
        }
        flag = false;
        containerItem['detail'].push(itemDetail);
      }
      if (flag)
        delete container[key];
    }
    if(container['vga']!=null){
      exec(
        'xrandr',
        function(err, stdout, stderr) {
          if (err) console.log('xrandr error'+err);
          else container['vga']['detail'][0]['desc']=stdout;
        }
      );
    }
    return callback(null);
  });
}
exports.getOutputInfo = getOutputInfo;

function getBusInputDeviceInfo(container, callback) {
  exec(
    'cat /proc/bus/input/devices',
    function(err, stdout, stderr) {
      if (err) return callback(err);
      var items = stdout.split('\n\n');
      // For each line get drive info and add to array
      for (var key in container) {
        var containerItem = container[key];
        var flag = true;
        for (var i = 0; i < items.length; i++) {
          var itemDetail = items[i];
          var itemDetailTmp = itemDetail.toLowerCase();
          if (itemDetailTmp.indexOf(key) < 0) { //&&itemDetailTmp.indexOf("sound") <0
            continue;
          }
          flag = false;
          var itemRst = {};
          var itemLines = itemDetail.split('\n');
          for (var j = 0; j < itemLines.length; j++) {
            var lineItem = itemLines[j];
            if (lineItem != '') {
              var eachLineItems = lineItem.split(': ');
              var detailRst = {};
              if (j === 0) {
                var eachLineItemDetail = eachLineItems[1].split(' ');
                for (var k = 0; k < eachLineItemDetail.length; k++) {
                  var detail = eachLineItemDetail[k];
                  if (detail != '') {
                    var eachI = detail.split('=');
                    if (eachI.length === 1)
                      detailRst[eachI[0]] = undefined;
                    else
                      detailRst[eachI[0]] = eachI[1];
                  }
                }
              } else {
                var eachLineItemDetail = eachLineItems[1].split('=');
                var len = eachLineItemDetail.length;
                if (len === 1)
                  detailRst[eachLineItemDetail[0]] = undefined;
                else if (len === 2)
                  detailRst[eachLineItemDetail[0]] = eachLineItemDetail[1];
                else {
                  var iiRst = eachLineItemDetail[1];
                  for (var ii = 2; ii < len; ii++) {
                    iiRst = iiRst + '=' + eachLineItemDetail[ii];
                  }
                  //iiRst=iiRst+'='+eachLineItemDetail[ii];
                  detailRst[eachLineItemDetail[0]] = iiRst;
                }
              }
              itemRst[eachLineItems[0]] = detailRst;
            }
          }

          containerItem['detail'].push(itemRst);
        }
        if (flag)
          delete container[key];
      }
      // Check if we have a callback
      return callback(null);
    }
  );
}
exports.getBusInputDeviceInfo = getBusInputDeviceInfo;


function getBusInfo(callback) {
  var aDrives = [];
  exec(
    'lsusb',
    function(err, stdout, stderr) {
      if (err) return callback(err, null);
      var aLines = stdout.split('\n');
      // For each line get drive info and add to array
      for (var i = 0; i < aLines.length; i++) {
        var sLine = aLines[i];
        if (sLine != '') {
          var aTokens = sLine.split(': ');
          aDrives[aDrives.length] = {
            desc: aTokens[0],
            id: aTokens[1].substring(3, 12),
            content: aTokens[1]
          };
        }
      }
      callback(null, aDrives);
    }
  );
}
exports.getBusInfo = getBusInfo;


function getDefaultPrinter() {
  exec('lpstat  -d', function(err, stdout, stderr) {
    if (err) {
      console.log('getDefaultPrinter err---' + err);
      return callback(err);
    }
    var aLines = stdout.split(': ');
    callback(null, aLines[1]);
  });
}

function getPrinterDesc(callback) {
  exec('lpstat  -p', function(err, stdout, stderr) {
    if (err) {
      console.log('printer err---' + err);
      return callback(err);
    }
    var aDrives = [];
    var aLines = stdout.split('\n');
    for (var i = 0; i < aLines.length; i++) {
      var sLine = aLines[i];
      if (sLine != '' && sLine.indexOf('...') < 0) {
        var aTokens = sLine.split(' ');
        var date = Array.prototype.slice.call(aTokens, 6, aTokens.length).toString();
        aDrives[aDrives.length] = {
          name: aTokens[1],
          state: aTokens[3].substring(0, aTokens[3].length - 1),
          date: date,
          dual: 0
        };
      }
    }
    callback(null, aDrives);
  });
}
exports.getPrinterDesc = getPrinterDesc;

function getPrinterInfo(callback) {
  var printers = printer.getPrinters();
  var rst = [];
  for (var i = 0; i < printers.length; i++) {
    var printerItem = printers[i];
    var pItem = {};
    pItem['name'] = printerItem['name'];
    pItem['isDefault'] = printerItem['isDefault'];
    pItem['status'] = printerItem['status'];
    pItem['device-uri'] = printerItem['options']['device-uri'];
    pItem['printer-state-change-time'] = printerItem['options']['printer-state-change-time'];
    rst.push(pItem);
  }
  callback(null, rst);
}
exports.getPrinterInfo = getPrinterInfo;

function getInputInfo(inputContainer, callback) {
  flowctl.series([{
    fn: function(pera_, cb_) {
      getBusInputDeviceInfo(inputContainer, function(err, rst) {
        if (err) console.log('getBusInputDeviceInfo error');
        cb_();
      });
    },
    pera: {}
  }, {
    fn: function(pera_, cb_) {
      getBusInfo(function(err, rst) {
        if (err) console.log('getBusInfo error');
        for (var key in inputContainer) {
          var inputContainerItem = inputContainer[key];
          var busInfoItems = inputContainerItem['detail'];
          for (var i = 0; i < busInfoItems.length; i++) {
            var busInfoItem = busInfoItems[i];
            var busInfoItemI = busInfoItem['I'];
            for (var i = 0; i < rst.length; i++) {
              var rstItem = rst[i];
              var idStr = rstItem['id'].split(':');
              if (busInfoItemI['Vendor'] == idStr[0] && busInfoItemI['Product'] == idStr[1]) {
                busInfoItem['desc'] = rstItem['desc'];
                busInfoItem['content'] = rstItem['content'];
              }
            }
          }
        }
        cb_();
      });
    },
    pera: {}
  }, {
    fn: function(pera_, cb_) {
      getPciInfo(function(err, rst) {
        if (err) console.log('getPciInfo error');
        for (var key in inputContainer) {
          var inputContainerItem = inputContainer[key];
          var busInfoItems = inputContainerItem['detail'];
          for (var i = 0; i < busInfoItems.length; i++) {
            var busInfoItem = busInfoItems[i];
            var busInfoItemSysfs = busInfoItem['S']['Sysfs'].split('/');
            for (var i = 0; i < rst.length; i++) {
              var rstItem = rst[i];
              var idStr = rstItem['id'];
              if (busInfoItemSysfs.length < 2) continue;
              else if (busInfoItemSysfs[3].indexOf(idStr) > 0) {
                busInfoItem['usbId'] = idStr;
                busInfoItem['usbTitle'] = rstItem['title'];
                busInfoItem['usbContent'] = rstItem['content'];
              }
            }
          }
        }
        cb_();
      });
    },
    pera: {}
  }], function(err_, rets_) {
    callback(err_)
  });
}
exports.getInputInfo = getInputInfo;

function getDiskInfo(callback) {
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
        var aTokens = sLine.split(' ');
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
    callback(null, aDrives);
  });
}
exports.getDiskInfo = getDiskInfo;
/*
var lim=[];
lim.push('camera');
lim.push('mouse');
lim.push('keyboard')
// getBusInfo(function(err, data) {
//   console.log(data);
// });

getInputInfo(lim,function(err, data) {
  console.log(data);
});

//console.log(screen.width)
*/