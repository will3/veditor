module.exports = function(parent) {
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var offset = new THREE.Vector3(0.5, 0.5, 0.5);
  geometry.vertices.forEach(function(v) {
    v.add(offset);
  });
  var mesh = new THREE.Mesh(geometry);
  var wireframe = new THREE.EdgesHelper(mesh, 0xffffff);
  wireframe.matrixAutoUpdate = true;

  wireframe.material.transparent = true;
  wireframe.material.opacity = 0.8;
  
  parent.add(wireframe);

  return {
    object: wireframe
  };
};
