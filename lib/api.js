var $ = require('jquery');

var Api = function() {
  this.hostUrl = 'http://localhost:3001/';
};

Api.prototype.listModels = function() {
  var url = this.hostUrl + 'model';

  return $.ajax({
    type: 'get',
    url: url
  });
};

Api.prototype.saveModel = function(data) {
  var url = this.hostUrl + 'model';

  return $.ajax({
    url: url,
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(data)
  });
}

Api.prototype.loadModel = function(id) {
  var url = this.hostUrl + 'model/' + id;

  return $.ajax({
    type: 'get',
    url: url
  });
};

Api.prototype.removeModel = function(id) {
  var url = this.hostUrl + 'model/' + id;

  return $.ajax({
    type: 'delete',
    url: url
  })
};

module.exports = Api;
