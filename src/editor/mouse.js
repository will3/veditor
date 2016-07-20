var Collision = require('./collision');

module.exports = function(e) {

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  function getCollision(camera, objects) {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects, true);

    if (intersects.length === 0) {
      return null;
    }

    var point = intersects[0].point;

    return new Collision(point);
  };

  return {
    getCollision: getCollision
  };
};
