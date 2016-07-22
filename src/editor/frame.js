var Voxel = require('voxel');
var Chunks = Voxel.Chunks;
var meshChunks = Voxel.meshChunks;

var Frame = function() {
  this.chunks = new Chunks();
  this.history = require('./history')(this.chunks);
  this.object = new THREE.Object3D();
};

Frame.prototype.updateMesh = function(blockMaterial) {
  meshChunks(this.chunks, this.object, blockMaterial);
};

Frame.prototype.getChunks = function() {
  return this.chunks;
};

module.exports = Frame;
