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

  fs.readFile(filePath, 'utf8', function(err, raw) {
    if (err) return next(err);

    var model = JSON.parse(raw);

    res.send(model);
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
