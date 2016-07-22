var libPath = require('path');
var fs = require('fs-extra');
var paths = require('../paths');

function save(req, res, next) {
  var body = req.body;
  var name = body.name;
  if (name == null) return next(new Error('must provide a name'));

  var savesPath = paths.savesPath;
  var filePath = libPath.join(savesPath, name);

  fs.ensureDir(savesPath, function(err) {
    if (err) return next(err);
    fs.writeFile(filePath, JSON.stringify(body), 'utf8', function(err) {
      if (err) return next(err);
      res.send({ ok: true });
    });
  });
};

module.exports = {
  save: save
};
