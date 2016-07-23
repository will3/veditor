var Layer = require('./layer');

var Critter = function() {
  this.object = new THREE.Object3D();
  this.layers = {};
  this.layerIndex = 0;
  this.addLayer(0);
  this.layerNeedsUpdate = false;
  // 0 show hidden as transaprent
  // 1 don't show hidden
  this.layerMode = 0;
  this.showAllLayers = false;
};

Critter.prototype.addLayer = function(index) {
  var layer = new Layer();
  this.layers[index] = layer;
  this.object.add(layer.object);
  return layer;
};

Critter.prototype.removeLayer = function(index) {
  var layer = this.layers[index];
  if (layer == null) {
    return;
  }
  layer.clear();
  this.object.remove(layer.object);
  delete this.layers[index];
};

Critter.prototype.setLayerIndex = function(index) {
  this.layerIndex = index;
  if (this.layers[index] == null) {
    return;
  }
  this.layerNeedsUpdate = true;
};

Critter.prototype.getCurrentLayer = function() {
  return this.layers[this.layerIndex];
};

Critter.prototype.getLayer = function(index) {
  return this.layers[index];
};

Critter.prototype.getLayers = function() {
  return this.layers;
};

Critter.prototype.getLayerIndex = function() {
  return this.layerIndex;
};

Critter.prototype.setLayerMode = function(value) {
  this.layerMode = value;
  this.layerNeedsUpdate = true;
};

Critter.prototype.getLayerMode = function() {
  return this.layerMode;
};

Critter.prototype.updateMesh = function(blockMaterial, transparentMaterial) {
  for (var i in this.layers) {
    var layer = this.layers[i];
    if (parseInt(i) === this.layerIndex) {
      layer.updateMesh(blockMaterial);
    } else {
      layer.updateMesh(transparentMaterial);
    }
  }

  if (this.layerNeedsUpdate) {
    this._updateLayer(blockMaterial, transparentMaterial);
    this.layerNeedsUpdate = false;
  }
};

Critter.prototype.getChunks = function() {
  return this.getCurrentLayer().getChunks();
};

Critter.prototype.getHistory = function() {
  return this.getCurrentLayer().getHistory();
};

Critter.prototype.clear = function() {
  for (var i in this.layers) {
    var layer = this.layers[i];
    layer.clear();
    this.object.remove(layer.object);
    delete this.layers[i];
  }
};

Critter.prototype.setShowAllLayers = function(value) {
  this.showAllLayers = value;
  this.layerNeedsUpdate = true;
};

Critter.prototype.serialize = function() {
  var layers = {};
  for (var i in this.layers) {
    layers[i] = this.layers[i].serialize()
  };

  return {
    type: 'Critter',
    layers: layers
  };
};

Critter.prototype.deserialize = function(data) {
  if (data.type === 'Layer') {
    data = {
      layers: {
        '0': data
      }
    }
  }

  this.clear();

  for (var i in data.layers) {
    var layer = data.layers[i];
    this.addLayer(i).deserialize(layer);
  }

  this.layerNeedsUpdate = true;

  // First layer Index
  this.layerIndex = parseInt(Object.keys(this.layers)[0]);
};

Critter.prototype._updateLayer = function(blockMaterial, transparentMaterial) {
  for (var i in this.layers) {
    var layer = this.layers[i];
    if (this.showAllLayers) {
      layer.setMaterial(blockMaterial);
      layer.object.visible = true;
      continue;
    }

    if (this.layerMode === 0) {
      layer.object.visible = true;
      if (parseInt(i) === this.layerIndex) {
        layer.setMaterial(blockMaterial);
      } else {
        layer.setMaterial(transparentMaterial);
      }
    } else if (this.layerMode === 1) {
      if (parseInt(i) === this.layerIndex) {
        layer.object.visible = true;
      } else {
        layer.object.visible = false;
      }
    }
  }
};

Critter.prototype.addFrame = function(skipCopy) {
  this.getCurrentLayer().addFrame(skipCopy);
};

Critter.prototype.removeFrame = function(index) {
  this.getCurrentLayer().removeFrame(index);
};

Critter.prototype.getCurrentFrame = function() {
  return this.getCurrentLayer().getCurrentFrame();
};

Critter.prototype.getFrames = function() {
  return this.getCurrentLayer().getFrames();
};

Critter.prototype.getFrameIndex = function() {
  return this.getCurrentLayer().getFrameIndex();
};

Critter.prototype.setFrameIndex = function(value) {
  this.getCurrentLayer().setFrameIndex(value);
};

module.exports = Critter;
