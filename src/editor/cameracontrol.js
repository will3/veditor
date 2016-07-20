var keycode = require('keycode');
var merge = require('./merge');

module.exports = function(camera) {
  var self = {};

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  var keyHolds = {};
  var upSpeed = 0.05;
  var rightSpeed = 0.05;
  var target = new THREE.Vector3();
  var rotation = new THREE.Euler(Math.PI / 4, Math.PI / 4, 0);
  rotation.order = 'YXZ';
  var xRange = [0 + 0.01, Math.PI / 2 - 0.01];

  function onKeyDown(e) {
    var key = keycode(e);
    keyHolds[key] = true;
  };

  function onKeyUp(e) {
    var key = keycode(e);
    keyHolds[key] = false;
  };

  function tick(dt) {
    var right = 0,
      up = 0;
    if (keyHolds['right']) { right++; }
    if (keyHolds['left']) { right--; }
    if (keyHolds['up']) { up++; }
    if (keyHolds['down']) { up--; }

    rotation.x -= up * upSpeed;
    rotation.y -= right * rightSpeed;

    if (rotation.x < xRange[0]) {
      rotation.x = xRange[0];
    } else if (rotation.x > xRange[1]) {
      rotation.x = xRange[1];
    }

    updateCamera();
  };

  function updateCamera() {
    var position = new THREE.Vector3(0, 0, -1)
      .applyEuler(rotation)
      .multiplyScalar(self.distance)
      .add(target);
    camera.position.copy(position);
    camera.lookAt(target);
  };

  merge(self, {
    tick: tick,
    distance: 80.0
  });

  return self;
};
