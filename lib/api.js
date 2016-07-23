var $ = require('jquery');

var Api = function() {
  this.hostUrl = 'http://localhost:3001/';
};

Api.prototype.save = function(data, callback) {
  var url = this.hostUrl + 'save';

  $.ajax({
    url: url,
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function() {
      callback(null);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      callback(errorThrown ||
        new Error('something went wrong'));
    }
  });
}

Api.prototype.list = function(callback) {
  var url = this.hostUrl + 'list';

  $.ajax({
    type: 'get',
    url: url,
    success: function(data) {
      callback(null, data);
    },
    error: function(xhr, textStatus, errorThrown) {
      callback(errorThrown ||
        new Error('something went wrong'));
    }
  });
};

Api.prototype.load = function(id, callback) {
  var url = this.hostUrl + 'list/' + id;

  $.ajax({
    type: 'get',
    url: url,
    success: function(data) {
      callback(null, data);
    },
    error: function(xhr, textStatus, errorThrown) {
      callback(errorThrown ||
        new Error('something went wrong'));
    }
  });
};

Api.prototype.remove = function(id, callback) {
  var url = this.hostUrl + 'list/' + id;

  $.ajax({
    type: 'delete',
    url: url,
    success: function(data) {
      callback(null);
    },
    error: function(xhr, textStatus, errorThrown) {
      return callback(errorThrown ||
        new Error('something went wrong'));
    }
  })
};

module.exports = Api;
