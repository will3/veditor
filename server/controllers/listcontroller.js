var Promise = require('bluebird');
var fs = require('fs-extra');
var _ = require('lodash');

var libPath = require('path');
var paths = require('../paths');

var version = "1";

function getList(req, res, next) {
  var savesPath = paths.savesPath;

  fs.readdirAsync(savesPath).then(function(files) {
    res.send(files);
  }).catch(function(err) {
    next(err);
  });
};

function get(req, res, next) {
  var id = req.params.id;

  if (id == null) {
    return next(new Error('must specify id'));
  }

  var savesPath = paths.savesPath;
  var filePath = libPath.join(savesPath, id);

  var model;
  fs.readFileAsync(filePath, 'utf8').then(function(data) {
    model = JSON.parse(data);
    var layers = model.data.layers;
    var layers2 = {};

    var getLayers = _.map(Object.keys(layers), function(name) {
      return _getLayer(name);
    });

    return Promise.all(getLayers);
  }).then(function(layers) {
    model.data.layers = _.keyBy(layers, 'name');
    res.send(model);
  }).catch(function(err) {
    next(err);
  });
};

function _getLayer(name) {
  var layersPath = paths.layersPath;
  var filePath = libPath.join(layersPath, name);
  return fs.readJsonAsync(filePath, 'utf8').then(function(data) {
    data.name = name;
    return data;
  });
};

function remove(req, res, next) {
  var id = req.params.id;

  if (id == null) {
    return next(new Error('must specify id'));
  }

  var savesPath = paths.savesPath;
  var filePath = libPath.join(savesPath, id);

  fs.unlinkAsync(filePath).then(function() {
    res.send({ ok: true });
  }).catch(function(err) {
    next(err);
  });
};

module.exports = {
  getList: getList,
  get: get,
  remove: remove
};
