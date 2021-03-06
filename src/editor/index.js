var Voxel = require('voxel');
var shortid = require('shortid');
var Chunks = Voxel.Chunks;
var Chunk = Voxel.Chunk;
var meshChunks = Voxel.meshChunks;
var merge = require('./merge');
var Mouse = require('./mouse');
var Critter = require('../../lib/editable/critter');

module.exports = function(parent, materials, camera, colorPicker, terminal) {
  var blockMaterial = materials.blockMaterial;
  var transparentMaterial = materials.transparentMaterial;

  var self = {};

  var editable = new Critter();

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

  var animations = {};

  require('./commands')(self, terminal);

  function start() {
    rootObject.add(object);
    parent.add(rootObject);
    rootObject.position.set(-size[0] / 2, -size[1] / 2, -size[2] / 2);

    var pref = preferences.get();
    if (pref.lastLoaded != null) {
      // Load last loaded
      // Todo refactor this
      terminal.commands['load']({ _: [pref.lastLoaded] }, terminal);
    }

    colorPicker.onSelect = function(index) {
      colorIndex = index + 1;
    };

    object.add(editable.object);
  };

  function tick(dt) {
    cameraControl.tick(dt);

    editable.tick(dt, blockMaterial, materials);
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

  function setCenter(e) {
    var objects = [ground.getPlane(), lastObject];
    var collision = Mouse(e).getCollision(camera, objects);

    if (collision == null) {
      return;
    }

    var coord = collision.coordAbove(camera, rootObject);

    if (coord != null) {
      editable.center = coord;
      editable.centerNeedsUpdate = true;
    }
  };

  function set(coord, v) {
    var chunks = getChunks();
    var lastV = chunks.get(coord.x, coord.y, coord.z);
    if (vEquals(lastV, v)) {
      return false;
    }
    chunks.set(coord.x, coord.y, coord.z, v);
    editable.getHistory().stage([coord.x, coord.y, coord.z, lastV, v]);
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
    editable.getHistory().commit();
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
    return editable.getChunks();
  };

  function undo() {
    editable.getHistory().undo();
  };

  function redo() {
    editable.getHistory().redo();
  };

  function move(offset) {
    var chunks = getChunks();

    var staging = [];
    chunks.visit(function(i, j, k, v) {
      var coord = new THREE.Vector3(i + offset.x, j + offset.y, k + offset.z);
      staging.push([coord, v]);
    });

    // Clear
    chunks.visit(function(i, j, k, v) {
      set(new THREE.Vector3(i, j, k), 0);
    });

    staging.forEach(function(line) {
      set(line[0], line[1]);
    });

    onFinishAdd();
  };

  function rotate(axis, angle) {
    var chunks = getChunks();

    if (editable.center == null) {
      return;
    }

    angle = angle || Math.PI / 2;
    var quat = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    var staging = [];

    chunks.visit(function(i, j, k, v) {
      var diff = new THREE.Vector3(i, j, k).sub(editable.center);
      var coord = diff.clone().applyQuaternion(quat).add(editable.center);
      coord.x = Math.round(coord.x);
      coord.y = Math.round(coord.y);
      coord.z = Math.round(coord.z);
      staging.push([coord, v]);
    });

    chunks.visit(function(i, j, k, v) {
      set(new THREE.Vector3(i, j, k, 0));
    });

    staging.forEach(function(line) {
      set(line[0], line[1]);
    });

    onFinishAdd();
  };

  function addAnimation(animation) {
    animations[animation.name] = animation;
  };

  merge(self, {
    editable: editable,
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
    redo: redo,
    setCenter: setCenter,
    move: move,
    rotate: rotate,
    addAnimation: addAnimation,
    animations: animations
  });

  start();

  return self;
};
