var Voxel = require('voxel');
var Chunks = Voxel.Chunks;
var meshChunks = Voxel.meshChunks;

var Frame = function() {
  this._chunks = new Chunks();
  this._history = require('../history')(this._chunks);
  this.object = new THREE.Object3D();
};

Frame.prototype.updateMesh = function(blockMaterial) {
  meshChunks(this._chunks, this.object, blockMaterial);
};

Frame.prototype.setMaterial = function(material) {
  for (var i = 0; i < this.object.children.length; i++) {
    this.object.children[i].material = material;
  }
};

Frame.prototype.getChunks = function() {
  return this._chunks;
};

Frame.prototype.getHistory = function() {
  return this._history;
};

Frame.prototype.serialize = function() {
  return this._chunks.serialize();
};

Frame.prototype.deserialize = function(data) {
  this._chunks.clear().deserialize(data);
};

Frame.prototype.clear = function() {
  this._chunks.clear();
  return this;
};

Frame.prototype.copy = function(frame) {
  var serialized = JSON.stringify(frame.getChunks().serialize());
  this.getChunks().clear().deserialize(JSON.parse(serialized));
  return this;
};

module.exports = Frame;
