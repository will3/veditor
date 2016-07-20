var THREE = require('three');

module.exports = function(parent, size) {

  var material = new THREE.LineBasicMaterial({
    color: 0xffffff
  });

  var geometry = new THREE.Geometry();
  var halfSize = size / 2;

  geometry.vertices.push(
    new THREE.Vector3(-halfSize, 0, -halfSize),
    new THREE.Vector3(halfSize, 0, -halfSize),
    new THREE.Vector3(halfSize, 0, halfSize),
    new THREE.Vector3(-halfSize, 0, halfSize),
    new THREE.Vector3(-halfSize, 0, -halfSize)
  );

  var lineSegment = new THREE.Line(geometry, material);
  parent.add(lineSegment);

  var planeGeometry = new THREE.PlaneGeometry(size, size);
  var material = new THREE.MeshBasicMaterial({
    color: 0xff0000
  });

  var mesh = new THREE.Mesh(planeGeometry, material);
  mesh.rotation.x = -Math.PI / 2;

  mesh.updateMatrixWorld();

  return {
    object: lineSegment,
    plane: mesh
  };
};
