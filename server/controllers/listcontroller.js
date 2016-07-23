var fs = require('fs-extra');
var libPath = require('path');
var paths = require('../paths');

var version = "1";

function getList(req, res, next) {
  var savesPath = paths.savesPath;

  fs.readdir(savesPath, function(err, files) {
    if (err) return next(err);

    res.send(files);
  });
};

function get(req, res, next) {
  var id = req.params.id;

  if (id == null) {
    return next(new Error('must specify id'));
  }

  var savesPath = paths.savesPath;
  var filePath = libPath.join(savesPath, id);

  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) return next(err);

    var model = JSON.parse(data);
    var layers = model.data.layers;
    var layers2 = {};
    var total = Object.keys(layers).length;
    var count = 0;

    // Get all layers
    for (var name in layers) {
      var layer = layers[name];

      getLayer(name, function(name) {
        return function(err, data) {
          if (err) return next(err);
          layers2[name] = JSON.parse(data);
          count++;

          if (count === total) {
            model.data.layers = layers2;
            res.send(model);
          }
        }
      }(name));
    }
  });
};

function getLayer(name, callback) {
  var layersPath = paths.layersPath;
  var filePath = libPath.join(layersPath, name);

  fs.readFile(filePath, 'utf8', function(err, data) {
    callback(err, data);
  });
};

function remove(req, res, next) {
  var id = req.params.id;

  if (id == null) {
    return next(new Error('must specify id'));
  }

  var savesPath = paths.savesPath;
  var filePath = libPath.join(savesPath, id);

  fs.unlink(filePath, function(err) {
    if (err) return next(err);
    res.send({ ok: true });
  });
};

module.exports = {
  getList: getList,
  get: get,
  remove: remove
};
