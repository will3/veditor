function Collision(intersect) {
  this.intersect = intersect;
};

Collision.prototype.coordAbove = function(camera) {
  var point = this.intersect.point;
  var dirStep = point.clone().sub(camera.position).setLength(0.01);
  var coord = floorVector(point.clone().sub(dirStep));
  // if (this.intersect.object.parent != null) {
  //   coord = this.intersect.object.parent.worldToLocal(coord);
  // }
  return coord;
};

Collision.prototype.coordBelow = function(camera) {
  var point = this.intersect.point;
  var dirStep = point.clone().sub(camera.position).setLength(0.01);
  var coord = floorVector(point.clone().add(dirStep));
  // if (this.intersect.object.parent != null) {
  //   coord = this.intersect.object.parent.worldToLocal(coord);
  // }
  return coord;
};

function floorVector(v) {
  v.x = Math.floor(v.x);
  v.y = Math.floor(v.y);
  v.z = Math.floor(v.z);
  return v;
};

module.exports = Collision;
