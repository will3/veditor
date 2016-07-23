var Frame = require('./frame');

/**
 * Represents a layer of a model
 */
var Layer = function() {
  this._frames = [];
  this._frameIndex = 0;
  this.object = new THREE.Object3D();
  this.name = null;

  this.addFrame();
};

Layer.prototype.addFrame = function() {
  var frame = new Frame();
  if (this._frames.length > 0) {
    frame.copy(this._frames[this._frameIndex]);
  }
  this.object.add(frame.object);
  // Insert frame
  this._frames.splice(this._frameIndex, 0, frame);
  this._updateFrame();

  if (this._frameIndex < 0) {
    this._frameIndex = 0;
  }

  return frame;
};

Layer.prototype.getFrameIndex = function() {
  return this._frameIndex;
};

Layer.prototype.setFrameIndex = function(value) {
  this._frameIndex = value;
  this._frameIndex %= this._frames.length;
  if (this._frameIndex < 0) {
    this._frameIndex += this._frames.length;
  }
  this._updateFrame();
};

Layer.prototype.removeFrame = function(index) {
  var frame = this._frames[index];
  if (frame == null) {
    return;
  }
  frame.clear();
  this._frames.splice(index, 1);
  if (this._frameIndex > this._frames.length - 1) {
    this._frameIndex = this._frames.length - 1;
  }
  this._updateFrame();
  return frame;
};

Layer.prototype.getCurrentFrame = function() {
  return this._frames[this._frameIndex];
};

Layer.prototype.getFrames = function() {
  return this._frames;
};

Layer.prototype._updateFrame = function() {
  for (var i = 0; i < this._frames.length; i++) {
    var frame = this._frames[i];
    if (i === this._frameIndex) {
      frame.object.visible = true;
    } else {
      frame.object.visible = false;
    }
  }
};

Layer.prototype.getHistory = function() {
  return this.getCurrentFrame().getHistory();
};

Layer.prototype.setMaterial = function(material) {
  this.getCurrentFrame().setMaterial(material);
};

Layer.prototype.updateMesh = function(blockMaterial) {
  this.getCurrentFrame().updateMesh(blockMaterial);
};

Layer.prototype.getChunks = function() {
  return this.getCurrentFrame().getChunks();
};

Layer.prototype.clear = function() {
  for (var i = 0; i < this._frames.length; i++) {
    this._frames[i].clear();
  }
  this._frames.splice(0, this._frames.length);
  return this;
};

Layer.prototype.copy = function(layer) {
  var serialized = JSON.stringify(layer.serialize());
  this.deserialize(JSON.parse(serialized));
  return this;
};

Layer.prototype.serialize = function() {
  var frames = [];
  for (var i = 0; i < this._frames.length; i++) {
    var frame = this._frames[i];
    frames.push(frame.serialize());
  }

  return {
    type: 'Layer',
    frames: frames,
    name: this.name
  };
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
    var frameData = data.frames[i];
    var frame = new Frame();
    this.object.add(frame.object);
    this._frames.push(frame);
    frame.deserialize(frameData);
  }

  this._updateFrame();

  this.name = data.name;
};

module.exports = Layer;

/**
 * Interface for models containing frames
 * 
 * @interface Framable
 */

/**
 * Add a frame, by deafult, insert after frameIndex and 
 * copies previous frame. Returns frame added
 * @function 
 * @name Framable#addFrame
 * @returns {Frame} frame added
 */

/**
 * Remove a frame at index
 * @function
 * @name Framable#removeFrame
 * @returns {Frame} frame removed
 */

/**
 * Get frame index
 * @function
 * @name Framable#getFrameIndex
 * @returns {Int} frame index
 */

/**
 * Set frame index
 * @function
 * @name Framable#setFrameIndex
 * @param {Int} index frame index
 */

/**
 * Get current frame
 * @function
 * @name Framable#getCurrentFrame
 */

/**
 * Get frames, if implemented, object is considered to implement Framable
 * @function
 * @name Framable#getFrames
 */
