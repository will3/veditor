var libPath = require('path');

var dataPath = libPath.join(__dirname, 'data');
var savesPath = libPath.join(dataPath, 'models');
var layersPath = libPath.join(dataPath, 'layers');

module.exports = {
  models: libPath.join(dataPath, 'models'),
  layers: libPath.join(dataPath, 'layers'),
  animations: libPath.join(dataPath, 'animations')
};
