var request = require('request');

var hostUrl = 'http://localhost:3000/';

module.exports = function() {
  function save(data, callback) {
    request.post(hostUrl + 'save', {
      body: data,
      json: true
    }, function(err, httpResponse, body) {
      if (err) {
        return callback(new Error('something went wrong'));
      }

      if (body == null || body.ok !== true) {
        return callback(new Error('something went wrong'));

      }

      callback(null);
    });
  };

  function list(callback) {
    request(hostUrl + 'list', function(err, httpResponse, body) {
      if (err) {
        return callback(new Error('something went wrong'));
      }

      return callback(null, JSON.parse(body));
    });
  };

  function load(id, callback) {
    var url = hostUrl + 'list/' + id;
    request(url, function(err, httpResponse, body) {
      if (err) {
        return callback(new Error('something went wrong'));
      }

      callback(null, JSON.parse(body));
    });
  };

  function remove(id, callback) {
    var url = hostUrl + 'list/' + id;
    request.delete(url, function(err, httpResponse, body) {
      if (err) {
        return callback(new Error('something went wrong'));
      }

      callback(null);
    });
  };

  return {
    save: save,
    list: list,
    load: load,
    remove: remove
  };
};
