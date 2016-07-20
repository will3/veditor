function Collision(point) {
  this.point = point;
};

Collision.prototype.coordAbove = function(camera) {
  var dirStep = this.point.clone().sub(camera.position).setLength(0.01);
  return floorVector(this.point.clone().sub(dirStep));
};

Collision.prototype.coordBelow = function() {
  var dirStep = this.point.clone().sub(camera.position).setLength(0.01);
  return floorVector(this.point.clone().add(dirStep));
};

function floorVector(v) {
  v.x = Math.floor(v.x);
  v.y = Math.floor(v.y);
  v.z = Math.floor(v.z);
  return v;
};

module.exports = Collision;
