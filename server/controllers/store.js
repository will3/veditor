var fs = require('fs-extra');
var libPath = require('path');

module.exports = function(opts) {
  var rootDir = opts.rootDir;
  var getTransform = opts.getTransform || null;

  function get(id) {
    var path = libPath.join(rootDir, id);
    var task = fs.readJsonAsync(path, 'utf8');
    if (getTransform != null) {
      return getTransform(task);
    }
    return task;
  };

  function remove(id) {
    var path = libPath.join(rootDir, id);
    return fs.unlinkAsync(path);
  };

  function list() {
    return fs.readdirAsync(rootDir);
  };

  function save(body, id) {
    var path = libPath.join(rootDir, id);
    return fs.ensureDirAsync(rootDir).then(function() {
      return fs.writeJsonAsync(path, body, 'utf8');
    });
  };

  function toController(opts) {
    opts = opts || {};
    var getTransform = opts.getTransform;

    return {
      get: function(req, res, next) {
        var id = req.params.id;
        var task = self.get(id);
        if (getTransform != null) {
          task = getTransform(task);
        }
        task.then(function(body) {
          res.send(body);
        }).catch(function(err) {
          next(err);
        });
      },

      remove: function(req, res, next) {
        var id = req.params.id;
        self.remove(id).then(function() {
          res.send({ ok: true });
        }).catch(function(err) {
          next(err);
        });
      },

      list: function(req, res, next) {
        self.list().then(function(names) {
          res.send(names);
        }).catch(function(err) {
          next(err);
        });
      },

      save: function(req, res, next) {
        var body = req.body;
        var id = req.body.data.name;
        self.save(body, id).then(function() {
          res.send({ ok: true });
        }).catch(function(err) {
          next(err);
        });
      }
    }
  };

  var self = {
    get: get,
    list: list,
    save: save,
    remove: remove,
    toController: toController
  };

  return self;
};
