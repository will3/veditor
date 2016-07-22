var Voxel = require('voxel');
var shortid = require('shortid');
var Chunks = Voxel.Chunks;
var Chunk = Voxel.Chunk;
var meshChunks = Voxel.meshChunks;
var merge = require('./merge');
var Mouse = require('./mouse');
var Frame = require('./frame');

module.exports = function(parent, blockMaterial, camera, colorPicker, terminal) {

  var self = {};

  var frame = new Frame();

  var colorIndex = 1;

  // Root object
  var rootObject = new THREE.Object3D();
  // Chunks object
  var object = new THREE.Object3D();
  // Chunks object clone
  var lastObject = new THREE.Object3D();

  // x z
  var size = [16, 16, 16];
  var ground = require('./ground')(rootObject, size);
  var cursor = require('./cursor')(rootObject);
  cursor.object.visible = false;

  var cameraDistanceRatio = 1 / 50.0 * 80.0;
  var cameraControl = require('./cameracontrol')(camera);
  cameraControl.setDistance(calcCameraDis());

  var input = require('./input')(self);

  var preferences = require('./preferences')();

  require('./commands')(self, terminal);

  function start() {
    rootObject.add(object);
    parent.add(rootObject);
    rootObject.position.set(-size[0] / 2, -size[1] / 2, -size[2] / 2);

    var pref = preferences.get();
    if (pref.lastLoaded != null) {
      // Load last loaded
      terminal.commands['load']({ _: [pref.lastLoaded] });
    }

    colorPicker.onSelect = function(index) {
      colorIndex = index + 1;
    };

    object.add(frame.object);
  };

  function tick(dt) {
    cameraControl.tick(dt);

    frame.updateMesh(blockMaterial);
  };

  function updateCursor(e) {
    var objects = [ground.getPlane(), lastObject];
    var collision = Mouse(e).getCollision(camera, objects);

    if (collision != null) {
      cursor.object.visible = true;
      var coordAbove = collision.coordAbove(camera, rootObject);
      cursor.object.position.copy(coordAbove);
    } else {
      cursor.object.visible = false;
    }
  };

  function add(e) {
    var objects = [ground.getPlane(), lastObject];
    var collision = Mouse(e).getCollision(camera, objects);

    if (collision == null) {
      return;
    }

    var coord = collision.coordAbove(camera, rootObject);
    var v = colorToVoxel(colorIndex)
    set(coord, v);
  };

  function remove(e) {
    var objects = [ground.getPlane(), lastObject];
    var collision = Mouse(e).getCollision(camera, objects);

    if (collision == null) {
      return;
    }

    if (collision.intersect.object === ground.getPlane()) {
      return;
    }

    var coord = collision.coordBelow(camera, rootObject);
    set(coord, 0);
  };

  function set(coord, v) {
    var chunks = getChunks();
    var lastV = chunks.get(coord.x, coord.y, coord.z);
    if (vEquals(lastV, v)) {
      return false;
    }
    chunks.set(coord.x, coord.y, coord.z, v);
    frame.history.stage([coord.x, coord.y, coord.z, lastV, v]);
  };

  /**
   * Check if two voxel equals
   * @return {Bool}
   */
  function vEquals(a, b) {
    if (a == null && b == null) {
      return true;
    } else if (a == null || b == null) {
      return false;
    }

    for (var i = 0; i < 6; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  };

  function onFinishAdd() {
    lastObject = object.clone();
    frame.history.commit();
  };

  function colorToVoxel(color) {
    return [color, color, color, color, color, color];
  };

  /**
   * Set size of canvas, also positions camera
   * @param {args} args i j k
   */
  function setSize(args, terminal) {
    if (args == null || args._.length !== 3) {
      terminal.log('usage: size i j k');
      return;
    }
    size = args._;

    ground.setSize(size);

    cameraControl.setDistance(calcCameraDis());

    rootObject.position.set(-size[0] / 2, -size[1] / 2, -size[2] / 2);
  };

  function getSize() {
    return size;
  };

  function calcCameraDis() {
    var maxSize = Math.max(size[0], size[1], size[2]);
    return maxSize * cameraDistanceRatio * parent.scale.x;
  };

  function getChunks() {
    return frame.getChunks();
  };

  function undo() {
    frame.history.undo();
  };

  function redo() {
    frame.history.redo();
  };

  merge(self, {
    commands: terminal.commands,
    tick: tick,
    preferences: preferences,
    updateCursor: updateCursor,
    add: add,
    remove: remove,
    onFinishAdd: onFinishAdd,
    setSize: setSize,
    getSize: getSize,
    set: set,
    getChunks: getChunks,
    undo: undo,
    redo: redo
  });

  start();

  return self;
};
