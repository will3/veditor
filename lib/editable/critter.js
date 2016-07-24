var Layer = require('./layer');
var Animation = require('./animation');

var Critter = function() {
  this.object = new THREE.Object3D();
  this.layers = [];
  this.layerIndex = 0;
  this.addLayer();
  this.layerNeedsUpdate = false;
  this.name = null;

  // If true, display critter in edit mode
  this.editMode = true;

  this.center = null;
  this.centerObject = new THREE.Sprite();
  this.object.add(this.centerObject);
  this.centerObject.hidden = true;
  this.centerNeedsUpdate = false;
  this.centerObject.scale.set(0.5, 0.5, 0.5);
};

Critter.prototype.addLayer = function() {
  var layer = new Layer();
  this.layers.push(layer);
  this.object.add(layer.object);
  return layer;
};

Critter.prototype.removeLayer = function(index) {
  if (index < 0 || index >= this.layers.length) {
    return;
  }

  var layer = this.layers[index];
  layer.clear();
  this.object.remove(layer.object);
  this.layers.splice(index, 1);
};

Critter.prototype.setLayerIndex = function(index) {
  if (index < 0 || index >= this.layers.length) {
    return;
  }

  this.layerIndex = index;
  this.layerNeedsUpdate = true;
}

Critter.prototype.getCurrentLayer = function() {
  return this.layers[this.layerIndex];
};

Critter.prototype.getLayer = function(index) {
  return this.layers[index];
};

Critter.prototype.getLayers = function() {
  return this.layers;
};

Critter.prototype.tick = function(dt, blockMaterial, materials) {
  var transparentMaterial = materials.transparentMaterial;

  for (var i = 0; i < this.layers.length; i++) {
    var layer = this.layers[i];
    var material = (i === this.layerIndex) ?
      blockMaterial :
      transparentMaterial;
    layer.tick(dt, material);
  }

  if (this.layerNeedsUpdate) {
    this._updateLayer(blockMaterial, transparentMaterial);
    this.layerNeedsUpdate = false;
  }

  if (this.centerNeedsUpdate) {
    this._updateCenter(materials.cross);
    this.centerNeedsUpdate = false;
  }
};

Critter.prototype.getChunks = function() {
  return this.getCurrentLayer().getChunks();
};

Critter.prototype.getHistory = function() {
  return this.getCurrentLayer().getHistory();
};

Critter.prototype.clear = function() {
  this.center = null;
  for (var i = 0; i < this.layers.length; i++) {
    var layer = this.layers[i];
    layer.clear();
    this.object.remove(layer.object);
  }

  this.layers.splice(0, this.layers.length);
  this.centerNeedsUpdate = true;
  this.layerNeedsUpdate = true;
};

Critter.prototype.setEditMode = function(value) {
  this.editMode = value;
  this.layerNeedsUpdate = true;
  this.centerNeedsUpdate = true;
};

Critter.prototype.serialize = function() {
  var layers = [];
  for (var i = 0; i < this.layers.length; i++) {
    layers.push(this.layers[i].serialize());
  };

  return {
    type: 'Critter',
    layers: layers,
    name: this.name,
    center: this.center == null ? null : this.center.toArray()
  };
};

Critter.prototype.deserialize = function(data) {

  this.clear();

  this.name = data.name;

  for (var i = 0; i < data.layers.length; i++) {
    var layer = data.layers[i];
    this.addLayer().deserialize(layer);
  }

  if (data.center != null) {
    this.center = new THREE.Vector3().fromArray(data.center);
  }

  this.layerNeedsUpdate = true;
  this.centerNeedsUpdate = true;
};

Critter.prototype._updateLayer = function(blockMaterial, transparentMaterial) {
  for (var i = 0; i < this.layers.length; i++) {
    var layer = this.layers[i];

    if (!this.editMode) {
      layer.setMaterial(blockMaterial);
      layer.object.visible = true && layer.visible;
      continue;
    }

    layer.object.visible = true && layer.visible;
    if (i === this.layerIndex) {
      layer.setMaterial(blockMaterial);
    } else {
      layer.setMaterial(transparentMaterial);
    }
  }
};

Critter.prototype._updateCenter = function(material) {
  if (this.editMode && this.center != null) {
    this.centerObject.visible = true;
    this.centerObject.position.copy(
      this.center.clone().add(new THREE.Vector3(0.5, 0.5, 0.5)));
    this.centerObject.material = material;
  } else {
    this.centerObject.visible = false;
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
