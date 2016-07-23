var libPath = require('path');

var dataPath = libPath.join(__dirname, 'data');
var savesPath = libPath.join(dataPath, 'models');
var layersPath = libPath.join(dataPath, 'layers');

module.exports = {
  savesPath: savesPath,
  modelsPath: savesPath,
  layersPath: layersPath
};
