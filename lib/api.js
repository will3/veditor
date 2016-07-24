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

Api.prototype.saveModel = function(model) {
  var url = this.hostUrl + 'model';

  var body = {
    version: '1',
    data: model.serialize()
  };

  return $.ajax({
    url: url,
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(body)
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

Api.prototype.listLayers = function() {
  var url = this.hostUrl + 'layer';

  return $.ajax({
    type: 'get',
    url: url
  });
};

Api.prototype.saveLayer = function(layer) {
  var url = this.hostUrl + 'layer';

  var body = {
    version: '1',
    data: layer.serialize()
  };

  return $.ajax({
    url: url,
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(body)
  });
}

Api.prototype.loadLayer = function(id) {
  var url = this.hostUrl + 'layer/' + id;

  return $.ajax({
    type: 'get',
    url: url
  });
};

Api.prototype.removeLayer = function(id) {
  var url = this.hostUrl + 'layer/' + id;

  return $.ajax({
    type: 'delete',
    url: url
  })
};

Api.prototype.listAnimations = function() {
  var url = this.hostUrl + 'ani';

  return $.ajax({
    type: 'get',
    url: url
  });
};

Api.prototype.saveAnimation = function(animation) {
  var url = this.hostUrl + 'ani';

  var body = {
    version: '1',
    data: animation.serialize()
  };

  return $.ajax({
    url: url,
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(body)
  });
}

Api.prototype.loadAnimation = function(id) {
  var url = this.hostUrl + 'ani/' + id;

  return $.ajax({
    type: 'get',
    url: url
  });
};

Api.prototype.removeAnimation = function(id) {
  var url = this.hostUrl + 'ani/' + id;

  return $.ajax({
    type: 'delete',
    url: url
  })
};

module.exports = Api;
