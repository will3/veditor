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
  var xRange = [-Math.PI / 2 + 0.01, Math.PI / 2 - 0.01];
  var zoomScale = 1.1;

  function onKeyDown(e) {
    var key = keycode(e);
    if (e.shiftKey) {
      keyHolds['shift+' + key] = true;
    }

    if (key === '=') {
      self.distance /= zoomScale;
    }

    if (key === '-') {
      self.distance *= zoomScale;
    }

    keyHolds[key] = true;
  };

  function onKeyUp(e) {
    var key = keycode(e);
    keyHolds['shift+' + key] = false;
    keyHolds[key] = false;
  };

  function tick(dt) {
    var right = 0,
      up = 0;
    var moveRight = 0;
    var moveUp = 0;
    if (keyHolds['shift+right']) {
      moveRight++;
    } else if (keyHolds['right']) {
      right++;
    }

    if (keyHolds['shift+left']) {
      moveRight--;
    } else if (keyHolds['left']) {
      right--;
    }

    if (keyHolds['shift+up']) {
      moveUp++;
    } else if (keyHolds['up']) {
      up++;
    }

    if (keyHolds['shift+down']) {
      moveUp--;
    } else if (keyHolds['down']) {
      up--;
    }

    rotation.x -= up * upSpeed;
    rotation.y -= right * rightSpeed;

    if (rotation.x < xRange[0]) {
      rotation.x = xRange[0];
    } else if (rotation.x > xRange[1]) {
      rotation.x = xRange[1];
    }

    var cameraForward = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
    var moveSpeed = 1.0;

    if (moveRight !== 0) {
      var cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      target.add(cameraRight.clone().multiplyScalar(moveRight * moveSpeed));
    }

    if (moveUp !== 0) {
      var cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
      target.add(cameraUp.clone().multiplyScalar(moveUp * moveSpeed));
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

  function setDistance(value) {
    self.distance = value;
    updateCamera();
  };

  merge(self, {
    tick: tick,
    distance: 80.0,
    setDistance: setDistance
  });

  return self;
};
