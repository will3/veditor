var Animation = function() {
  // Frames to play in sequence
  this.sequence = [];
  // Frame interval
  this.frameIntervals = [];
  // Default frame interval
  this.defaultFrameInterval = 0.2;
  // Name of animation
  this.name = null;
  // Interval counter
  this.counter = 0;
  // How many times left to play, negative means loop, stop at 0
  this.times = 0;
  // Current sequence index
  this.sequenceIndex = 0;
  // Start flag
  this._started = false;
};

Animation.prototype.serialize = function() {
  return {
    sequence: this.sequence,
    frameIntervals: this.frameIntervals,
    defaultFrameInterval: this.defaultFrameInterval,
    name: this.name
  };
};

Animation.prototype.deserialize = function(data) {
  this.sequence = data.sequence;
  this.frameIntervals = data.frameIntervals || [];
  this.defaultFrameInterval = data.defaultFrameInterval;
  this.name = data.name;
  return this;
};

Animation.prototype.tick = function(dt, layer) {
  if (!this._started) {
    layer.setFrameIndex(this.sequence[this.sequenceIndex]);
    this._started = true;
  }

  if (this.times === 0) {
    return;
  }

  this.counter += dt;

  var frameInterval = this.frameIntervals[this.sequenceIndex] || this.defaultFrameInterval;

  if (this.counter > frameInterval) {
    this.counter -= frameInterval;

    // Advance to next sequence
    this.sequenceIndex++;
    if (this.sequenceIndex >= this.sequence.length) {
      // Played once, reduce counter
      this.times -= 1;
      this.sequenceIndex = 0;
    }

    layer.setFrameIndex(this.sequence[this.sequenceIndex]);
  }
};

module.exports = Animation;
