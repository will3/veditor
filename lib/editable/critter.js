var Layer = require('./layer');

var LayerMode = {
  Default: 0,
  HideInActive: 1
};

var Critter = function() {
  this.object = new THREE.Object3D();
  this.layers = {};
  this.activeLayerName = null;
  this.addLayer('defaut');
  this.layerNeedsUpdate = false;
  this.name = null;

  // 0 show hidden as transaprent
  // 1 don't show hidden
  this.layerMode = LayerMode.Default;

  // If true, display critter in edit mode
  this.editMode = true;
};

Critter.prototype.addLayer = function(name) {
  var layer = new Layer();
  this.layers[name] = layer;
  this.object.add(layer.object);
  return layer;
};

Critter.prototype.removeLayer = function(name) {
  var layer = this.layers[name];
  if (layer == null) {
    return;
  }
  layer.clear();
  this.object.remove(layer.object);
  delete this.layers[name];
};

Critter.prototype.setActiveLayerName = function(name) {
  if (this.layers[name] == null) {
    return;
  }

  // Convert to string
  this.activeLayerName = name + '';
  this.layerNeedsUpdate = true;
};

Critter.prototype.getCurrentLayer = function() {
  return this.layers[this.activeLayerName];
};

Critter.prototype.getLayer = function(name) {
  return this.layers[name];
};

Critter.prototype.getLayers = function() {
  return this.layers;
};

Critter.prototype.setLayerMode = function(value) {
  this.layerMode = value;
  this.layerNeedsUpdate = true;
};

Critter.prototype.updateMesh = function(blockMaterial, transparentMaterial) {
  for (var name in this.layers) {
    var layer = this.layers[name];
    var material = (name === this.activeLayerName) ?
      blockMaterial :
      transparentMaterial;
    layer.updateMesh(material);
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
  for (var name in this.layers) {
    var layer = this.layers[name];
    layer.clear();
    this.object.remove(layer.object);
    delete this.layers[name];
  }
};

Critter.prototype.setEditMode = function(value) {
  this.editMode = value;
  this.layerNeedsUpdate = true;
};

Critter.prototype.serialize = function() {
  var layers = {};
  for (var name in this.layers) {
    layers[name] = this.layers[name].serialize()
  };

  console.log(this.name);

  return {
    type: 'Critter',
    layers: layers,
    name: this.name
  };
};

Critter.prototype.deserialize = function(data) {
  if (data.type === 'Layer') {
    data = {
      layers: {
        'unnamed': data
      },
      name: null
    }
  }

  this.clear();

  this.name = data.name;

  for (var name in data.layers) {
    var layer = data.layers[name];
    this.addLayer(name).deserialize(layer);
  }

  this.activeLayerName = Object.keys(this.layers)[0];

  this.layerNeedsUpdate = true;
};

Critter.prototype._updateLayer = function(blockMaterial, transparentMaterial) {
  for (var name in this.layers) {
    var layer = this.layers[name];
    if (!this.editMode) {
      layer.setMaterial(blockMaterial);
      layer.object.visible = true;
      continue;
    }

    // In edit mode
    if (this.layerMode === LayerMode.Default) {
      layer.object.visible = true;
      if (name === this.activeLayerName) {
        layer.setMaterial(blockMaterial);
      } else {
        layer.setMaterial(transparentMaterial);
      }
    } else if (this.layerMode === LayerMode.HideInActive) {
      if (name === this.activeLayerName) {
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
