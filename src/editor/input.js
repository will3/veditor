var THREE = require('three');

module.exports = function(editor) {
  var mouseHold = {};
  var lastAdd = new THREE.Vector2();

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    editor.updateCursor(e);

    if (mouseHold[0]) {
      var pos = eToVector2(e);
      var dis = pos.distanceTo(lastAdd);
      var dir = pos.clone().sub(lastAdd).normalize();

      if (dis >= self.minStep) {
        for (var step = self.minStep; step <= dis; step += self.minStep) {
          var pos2 = lastAdd.clone().add(dir.clone().multiplyScalar(step));
          editor.add(vector2ToE(pos2));
        }

        lastAdd = pos;
      }
    }
  };

  function onMouseDown(e) {
    mouseHold[e.button] = true;
    if (e.button === 0) {
      editor.add(e);
      lastAdd = eToVector2(e);
    }
  };

  function onMouseUp(e) {
    mouseHold[e.button] = false;
    editor.onFinishAdd();
  };

  var self = {
    minStep: 2,
    onMouseMove: onMouseMove,
    onMouseDown: onMouseDown,
    onMouseUp: onMouseUp
  };

  return self;
};

function eToVector2(e) {
  return new THREE.Vector2(e.clientX, e.clientY);
};

function vector2ToE(vector) {
  return { clientX: vector.x, clientY: vector.y };
}
