var libPath = require('path');
var fs = require('fs-extra');
var paths = require('../paths');
var _ = require('lodash');

function save(req, res, next) {
  var body = req.body;
  var name = body.name;
  if (name == null) {
    return next(new Error('must provide a name'));
  }

  if (body.data.type !== 'Critter') {
    return next(new Error('format not supported'));
  }

  try {
    saveCritter(body, res);
  } catch (err) {
    return next(err);
  }
};

function saveCritter(body, res) {
  var layers = body.data.layers;
  var layersPath = paths.layersPath;

  fs.ensureDir(layersPath, function(err) {
    if (err) throw err;

    var total = 0;
    var count = 0;

    for (var i in layers) {
      total++;
      var layer = layers[i];
      var filePath = libPath.join(layersPath, layer.name);

      fs.writeFile(filePath, JSON.stringify(layer), 'utf8', function(err) {
        if (err) throw err;

        count++;

        if (count === total) {
          // Finished storing layers

          body.data.layers = _.mapValues(layers, function(layer) {
            return {
              name: layer.name
            }
          });

          // Store actual model
          var savesPath = paths.savesPath;
          var filePath = libPath.join(savesPath, body.name);

          console.log(filePath);
          console.log(JSON.stringify(body));

          fs.ensureDir(savesPath, function(err) {
            if (err) throw err;
            fs.writeFile(filePath, JSON.stringify(body), 'utf8', function(err) {
              if (err) throw err;
              res.send({ ok: true });
            });
          });
        }
      });
    }
  });
};

module.exports = {
  save: save
};
