var libPath = require('path');

var dataPath = libPath.join(__dirname, 'data');
var savesPath = libPath.join(dataPath, 'models');

module.exports = {
  dataPath: dataPath,
  savesPath: savesPath
};
