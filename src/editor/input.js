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

    if (mouseHold[0]) {
      onDrag(e, 0);
    } else if (mouseHold[2]) {
      onDrag(e, 2);
    }
  };

  function onMouseDown(e) {
    mouseHold[e.button] = true;
    if (e.button === 0) {
      if (e.shiftKey) {
        editor.setCenter(e);
      } else {
        editor.add(e);
        lastAdd = eToVector2(e);
      }
    } else if (e.button === 2) {
      editor.remove(e);
      lastAdd = eToVector2(e);
    }
  };

  function onMouseUp(e) {
    mouseHold[e.button] = false;
    editor.onFinishAdd();
  };

  var dirKeys = ['w', 's', 'a', 'd', 'r', 'f'];

  var keyToDir = {
    'w': new THREE.Vector3(0, 0, 1),
    's': new THREE.Vector3(0, 0, -1),
    'a': new THREE.Vector3(1, 0, 0),
    'd': new THREE.Vector3(-1, 0, 0),
    'r': new THREE.Vector3(0, 1, 0),
    'f': new THREE.Vector3(0, -1, 0)
  };

  function onKeyDown(e) {
    var key = keycode(e);

    if (key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
      editor.redo();
      e.preventDefault();
    } else if (key === 'z' && (e.ctrlKey || e.metaKey)) {
      editor.undo();
      e.preventDefault();
    }

    for (var i = 0; i < dirKeys.length; i++) {
      if (key === dirKeys[i]) {
        var dir = keyToDir[key].clone();
        if (e.shiftKey) {
          editor.rotate(dir);
        } else {
          editor.move(dir);
        }
      }
    }

    var editable = editor.editable;
    if (editable.getFrames != null) {
      if (key === ']') {
        editable.setFrameIndex(editable.getFrameIndex() + 1);
      } else if (key === '[') {
        editable.setFrameIndex(editable.getFrameIndex() - 1);
      }
    }

    var layerNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var allLayerNumber = '0';
    if (editable.getLayers != null) {
      var layers = editable.layers;

      for (var i = 0; i < layerNumbers.length; i++) {
        if (key === layerNumbers[i]) {
          var index = parseInt(key) - 1;
          var layer = editable.layers[index];
          if (layer == null) {
            break;
          }
          if (e.shiftKey) {
            layer.setVisible(!layer.visible);
          } else {
            editable.setLayerIndex(index);
            layer.setVisible(true);
          }
        }
      }

      if (key === allLayerNumber) {
        if (e.shiftKey) {
          var allShown = true;
          for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (!layer.visible) {
              allShown = false;
              break;
            }
          }

          for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            layer.setVisible(!allShown);
          }
        }
      }
    }


    if (key === 'enter') {
      if (editable.getLayers != null) {
        editable.setEditMode(!editable.editMode);
      }
    }

    if (key === '/') {
      if (editable.getLayers != null) {
        editable.setLayerMode(editable.layerMode === 0 ? 1 : 0);
      }
    }
  };

  function onKeyUp(e) {};

  function onDrag(e, button) {
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
