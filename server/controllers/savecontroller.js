var libPath = require('path');

var Promise = require('bluebird');
var fs = require('fs-extra');

var paths = require('../paths');
var _ = require('lodash');

function save(req, res, next) {
  var body = req.body;
  if (body.data.name == null) {
    return next(new Error('must provide a name'));
  }

  if (body.data.type !== 'Critter') {
    return next(new Error('format not supported'));
  }

  saveAll(body).then(function() {
    res.send({ ok: true });
  }).catch(function(err) {
    next(err);
  });
};

function saveAll(body, res) {
  var layers = body.data.layers;
  var layersPath = paths.layersPath;

  return fs.ensureDirAsync(layersPath)
    .then(function() {
      var saveLayers = _.map(Object.keys(layers), function(name) {
        return saveLayer(layers[name], name);
      });

      return Promise.all(saveLayers);
    }).then(function() {
      body.data.layers = _.mapValues(layers, function(layer) {
        return { name: layer.name }
      });
      return saveModel(body);
    })
};

function saveModel(body) {
  var name = body.data.name;
  var savesPath = paths.savesPath;
  var filePath = libPath.join(savesPath, body.data.name);

  return fs.ensureDirAsync(savesPath)
    .then(function() {
      return fs.writeJsonAsync(filePath, body, 'utf8');
    });
};

function saveLayer(layer, name) {
  var layersPath = paths.layersPath;
  var filePath = libPath.join(layersPath, name);
  layer.name = name;
  return fs.writeJsonAsync(filePath, layer, 'utf8');
};

module.exports = {
  save: save
};
