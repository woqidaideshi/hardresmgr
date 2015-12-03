var fs = require('fs'),
  path = require("path"),
  http = require('http'),
  cp = require('child_process'),
  utils = require('utils'),
  flowctl = utils.Flowctl(),
  json4line = utils.Json4line(),
  channel = require('./channel');
var configPath = __dirname + '/config.json';
var resourceData=require('./resourceData');

function ResourceManager(ret_) {
  var self = this;
  var ret = ret_ || {
    success: function() {},
    fail: function() {}
  };
  this._resource = {};
  this._cpiCmd=null ;
  this._inputDeviceCmd=null;
  this._cmdExtended =null;

  // TODO: use flow control to make sure these two
  channel.localServStart();
  this._initResource(function(err) {
    if (err) return ret.fail(err);
    return ret.success();
  });
}

ResourceManager.prototype._initResource = function(callback_) {
  var self = this;
  try {
    json4line.readJSONFile(configPath, function(err_, data_) {
      if (err_) return callback_(err_);
      self._resource = data_;
      self._cpiCmd = 'lspci';
      self._inputDeviceCmd = 'cat /proc/bus/input/devices';
      self._cmdExtended = ' | grep ';
      self._initHardResourceList(function(err_) {
        if (err_) return callback_(err_);
        callback_(null);
      });
    });
  } catch (e) {
    console.log('init resource error ' + e);
  }
}
ResourceManager.prototype.refreshResource = function(callback_) {
  var self = this;
  self._initResource(function(err_){
    callback_(err_,self._resource);
  });
}

ResourceManager.prototype.getResourceList = function(argObj_, callback_) {
  var self = this;
  try {
    var args = argObj_.type;
    switch (args[0]) {
      case 'all':
        {
          callback_(null, self._resource);
        }
        break;
      default:
        {
          var argsNxt = Array.prototype.slice.call(args, 1, args.length);
          self._getResouceListByCate(argsNxt, callback_);
        }
    }
  } catch (e) {
    callback_('get resource list fail '+e);
  }
}

ResourceManager.prototype.getCateList = function(argObj_, callback_) {
  var self = this;
  var rst=self._resource;
  for(var i =1;i< Object.keys(argObj_).length;i++){
    if(rst['detail'][argObj_[i]]===undefined)return callback_('no such type',undefined);
    else {
      rst=rst['detail'][argObj_[i]];
    }
  }
  var rstSet=[];
  for(var key in rst['detail']){
    rstSet.push(key)
  }
  var rstObj={};
  for(var key in rst){
    rstObj[key]=rst[key];
  }
  rstObj['detail']={};
  callback_(undefined,rstObj);
}

// TODO: add a channel property into rstObj for getting data
ResourceManager.prototype.applyResource = function(argObj_, callback_) {
  var self = this;
  var rst = undefined;
  var rstObj = undefined;
  var tmpDetail = undefined;
  var abort = false;
  try {
    var funcAllowOrNot = function(args, funcCb) {
      if (abort) {
        funcCb();
      } else {
        self._getResouceForApply(args, function(err_, rst_) {
          if (err_) {
            if (args['option'] === undefined || args.option !== 0) abort = true;
            console.log('applyResource error when get resource ' + err_);
          } else {
            if (rst === undefined) {
              rst = [];
              tmpDetail = {};
              rstObj = {};
              rstObj['type'] = argObj_.type;
              rstObj['detail'] = rst;
            }
            tmpDetail[rst_] = args;
            rst.push(rst_);
          }
          funcCb();
        });
      }
    }
    var detailRst = undefined;
    var funcApply = function(args, funcCb) {
      self._setResourceState(args, 1, function(err_, rst_) {
        if (err_) {
          console.log('apply  Resource error when set state ' + err_);
        } else {
          if (detailRst === undefined) {
            detailRst = [];
          }
          detailRst.push(tmpDetail[args]);
        }
        funcCb();
      });
    }
    var argObj = argObj_.detail;
    flowctl.parallel1(argObj, funcAllowOrNot, function(err_, rets_) {
      if (abort || rstObj === undefined) {
        callback_('apply abort');
      } else {
        flowctl.parallel1(rstObj['detail'], funcApply, function(err_, rets_) {
          if (detailRst === undefined) {
            callback_('apply  failed');
          } else {
            rstObj['detail'] = detailRst;
            callback_(null, rstObj);
          }
        });
      }
    });
  } catch (e) {
    callback_('apply resource fail '+e);
  }
}

ResourceManager.prototype.releaseResource = function(argObj_, callback_) {
  var self = this;
  var rst = undefined;
  var rstObj = undefined;
  try {
    var funcRst = function(argsTmp_, cb_) {
      if (rst === undefined) {
        rst = [];
        rstObj = {};
        rstObj['type'] = argObj_.type;
        rstObj['detail'] = rst;
      }
      rst.push(argsTmp_);
      cb_();
    }
    var releaseFunc = function(args, funcCb) {
      self._getResouceListByCate(args.type, function(err_, rst_) {
        if (err_) {
          console.log('releaseResource error when get resource ' + err_);
          funcCb();
        } else {
          if (rst_.state === 1) {
            self._setResourceState(rst_, 0, function(err_, rst_) {
              if (err_) {
                console.log('releaseResource error when set state ' + err_);
                funcCb();
              } else {
                funcRst(args, function() {
                  funcCb();
                });
              }
            });
          }else funcCb();
        }
      });
    }
    var argObj = argObj_.detail;
    flowctl.parallel1(argObj, releaseFunc, function(err_, rets_) {
      if (rstObj === undefined) return callback_(err_ || 'release no one');
      callback_(null, rstObj);
    });
  } catch (e) {
    callback_('release resource fail ' + e);
  }
}

ResourceManager.prototype._getResouceForApply = function(argObj_, callback_) {
  var self = this;
  self._getResouceListByCate(argObj_.type, function(err_, rst_) {
    if (err_) return callback_(err_);
    if (rst_.state === 1) return callback_('unAvailable');
    callback_(null, rst_);
  });
}

ResourceManager.prototype._setResourceState = function(item_,state_ ,callback_) {
  var self = this;
  try{
    item_.state=state_;
    callback_(null,item_);
  }catch(e){
    callback_(e,item_);
  }
}
ResourceManager.prototype._initHardResourceList=function(callback_) {
  var self=this;
  try {
    flowctl.parallel([{
      fn: function(pera_, fnCb_) {
        self._getOutputInfo(fnCb_);
      },
      pera: {}
    }, {
      fn: function(pera_, fnCb_) {
        self._getInputInfo(fnCb_);
      },
      pera: {}
    }, {
      fn: function(pera_, fnCb_) {
        self._getDiskInfo(fnCb_);
      },
      pera: {}
    }, {
      fn: function(pera_, fnCb_) {
        self._getPrinterInfo(fnCb_);
      },
      pera: {}
    }], function(err_, rets_) {
      callback_(err_);
    });
  } catch (e) {
    callback_(e);
  }
}
ResourceManager.prototype._getResouceListByCate = function(args_, callback_) {
  var self=this;
  var item = undefined;
  switch (args_.length) {
    case 1:
      {
        item = self._resource.detail[args_[0]];
      }
      break;
    case 2:
      {
        item = self._resource.detail[args_[0]].detail[args_[1]];
      }
      break;
    default:
      {}
  }
  if(item===undefined) callback_('no such resource ',item);
  else callback_(false,item);
}
//output
ResourceManager.prototype._getOutputInfo=function(callback_) {
   var self=this;
  resourceData.getOutputInfo(self._resource.detail['output']['detail'],function(err){
    if(err)return callback_(err);
    callback_(null);
  });
}

//input
ResourceManager.prototype._getInputInfo=function(callback_) {
  var self=this;
  resourceData.getInputInfo(self._resource.detail['input']['detail'],function(err){
    if(err)return callback_(err);
    callback_(null);
  });
}

//disk
ResourceManager.prototype._getDiskInfo=function(callback_) {
  var self=this;
  resourceData.getDiskInfo(function(err,rstArr){
    if(err)return callback_(err);
    self._resource.detail['disk'].detail=rstArr;
    callback_(null);
  });
}
ResourceManager.prototype._getPrinterInfo = function(callback_) {
  var self = this;
  resourceData.getPrinterInfo(function(err,rstArr){
    if(err){
      delete self._resource.detail['printer'];
      return callback_(err);
    }
    self._resource.detail['printer'].detail=rstArr;
    callback_(null);
  });
}

var stub = null;
(function main() {
  var hardResMgr = new ResourceManager({
    success: function() {
      stub = require('../interface/hardresmgrStub').getStub(hardResMgr);
      console.log('hard resource manager start OK');
    },
    fail: function(error) {
      hardResMgr = null;
      console.log('hard resource manager start failed:', error);
    }
  });
})();
