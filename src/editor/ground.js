var THREE = require('three');

module.exports = function(parent, size) {
  var size = size;
  var edgesObject;
  var planeObject;

  updateEdges();
  updatePlane();

  function updateEdges() {
    if (edgesObject != null) {
      edgesObject.geometry.dispose();
      edgesObject.material.dispose();
      edgesObject.parent.remove(edgesObject);
    }

    var material = new THREE.LineBasicMaterial({
      color: 0xffffff
    });

    var geometry = new THREE.Geometry();
    var halfSize = [size[0] / 2, size[1] / 2, size[2] / 2];

    geometry.vertices.push(
      new THREE.Vector3(-halfSize[0], 0, -halfSize[2]),
      new THREE.Vector3(halfSize[0], 0, -halfSize[2]),
      new THREE.Vector3(halfSize[0], 0, halfSize[2]),
      new THREE.Vector3(-halfSize[0], 0, halfSize[2]),
      new THREE.Vector3(-halfSize[0], 0, -halfSize[2])
    );

    edgesObject = new THREE.Line(geometry, material);
    parent.add(edgesObject);
  };

  function updatePlane() {
    if (planeObject != null) {
      planeObject.geometry.dispose();
      planeObject.material.dispose();
    }

    var planeGeometry = new THREE.PlaneGeometry(size[0], size[2]);
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000
    });

    var mesh = new THREE.Mesh(planeGeometry, material);
    mesh.rotation.x = -Math.PI / 2;

    mesh.updateMatrixWorld();
    planeObject = mesh;
  };

  function setSize(value) {
    size = value;
    updateEdges();
    updatePlane();
  };

  function getObject() {
    return edgesObject;
  };

  function getPlane() {
    return planeObject;
  };

  return {
    getObject: getObject,
    getPlane: getPlane,
    setSize: setSize
  };
};
