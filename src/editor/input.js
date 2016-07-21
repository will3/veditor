var THREE = require('three');
var keycode = require('keycode');

module.exports = function(editor) {
  var mouseHold = {};
  var lastAdd = new THREE.Vector2();

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
  }

  function onMouseMove(e) {
    editor.updateCursor(e);

    if (mouseHold[0] || mouseHold[2]) {
      onDrag(e);
    }
  };

  function onMouseDown(e) {
    mouseHold[e.button] = true;
    if (e.button === 0) {
      editor.add(e);
      lastAdd = eToVector2(e);
    } else if (e.button === 2) {
      editor.remove(e);
      lastAdd = eToVector2(e);
    }
  };

  function onMouseUp(e) {
    mouseHold[e.button] = false;
    editor.onFinishAdd();
  };

  function onKeyDown(e) {
    var key = keycode(e);

    if (key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
      editor.history.redo();
      e.preventDefault();
    } else if (key === 'z' && (e.ctrlKey || e.metaKey)) {
      editor.history.undo();
      e.preventDefault();
    }
  };

  function onKeyUp(e) {

  };

  function onDrag(e) {
    var button = e.button;
    var pos = eToVector2(e);
    var dis = pos.distanceTo(lastAdd);
    var dir = pos.clone().sub(lastAdd).normalize();

    if (dis >= self.minStep) {
      for (var step = self.minStep; step <= dis; step += self.minStep) {
        var pos2 = lastAdd.clone().add(dir.clone().multiplyScalar(step));
        if (button === 0) {
          editor.add(vector2ToE(pos2));
        } else if (button === 2) {
          editor.remove(vector2ToE(pos2));
        }
      }

      lastAdd = pos;
    }
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
