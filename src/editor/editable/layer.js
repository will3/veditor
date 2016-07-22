var Frame = require('./frame');

var Layer = function() {
  this._frames = [];
  this.frameIndex = 0;
  this.object = new THREE.Object3D();

  this.addFrame();
};

Layer.prototype.addFrame = function(skipCopy) {
  skipCopy = skipCopy || false;
  var frame = new Frame();
  if (this._frames.length > 0 && !skipCopy) {
    frame.copy(this._frames[this.frameIndex]);
  }
  this.object.add(frame.object);
  // Insert frame
  this._frames.splice(this.frameIndex, 0, frame);
  this._updateFrame();

  if (this.frameIndex < 0) {
    this.frameIndex = 0;
  }

  return frame;
};

Layer.prototype.removeFrame = function(index) {
  var frame = this._frames[index];
  if (frame == null) {
    return;
  }
  frame.clear();
  this._frames.splice(index, 1);
  if (this.frameIndex > this._frames.length - 1) {
    this.frameIndex = this._frames.length - 1;
  }
  this._updateFrame();
};

Layer.prototype.nextFrame = function() {
  this.frameIndex++;
  this.frameIndex %= this._frames.length;
  this._updateFrame();
};

Layer.prototype.lastFrame = function() {
  this.frameIndex--;
  this.frameIndex %= this._frames.length;
  this._updateFrame();
};

Layer.prototype.getFrames = function() {
  return this._frames;
};

Layer.prototype._updateFrame = function() {
  for (var i = 0; i < this._frames.length; i++) {
    var frame = this._frames[i];
    if (i === this.frameIndex) {
      frame.object.visible = true;
    } else {
      frame.object.visible = false;
    }
  }
};

Layer.prototype.getHistory = function() {
  return this.getCurrentFrame().getHistory();
};

Layer.prototype.updateMesh = function(blockMaterial) {
  this.getCurrentFrame().updateMesh(blockMaterial);
};

Layer.prototype.getChunks = function() {
  return this.getCurrentFrame().getChunks();
};

Layer.prototype.getCurrentFrame = function() {
  return this._frames[this.frameIndex];
};

Layer.prototype.serialize = function() {
  var frames = [];
  for (var i = 0; i < this._frames.length; i++) {
    var frame = this._frames[i];
    frames.push(frame.serialize());
  }

  return {
    type: 'Layer',
    frames: frames
  };
};

Layer.prototype.clear = function() {
  for (var i = this._frames.length - 1; i >= 0; i--) {
    this.removeFrame(i);
  }
};

Layer.prototype.deserialize = function(data) {
  var type = data.type || 'Frame';

  // Convert
  if (type === 'Frame') {
    data = {
      frames: [data]
    };
  }

  this.clear();

  for (var i = 0; i < data.frames.length; i++) {
    var frame = data.frames[i];
    // Skip copy
    this.addFrame(true).deserialize(frame);
  }

  this._updateFrame();
};

module.exports = Layer;
