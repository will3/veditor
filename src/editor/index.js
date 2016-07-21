var Voxel = require('voxel');
var Chunks = Voxel.Chunks;
var Chunk = Voxel.Chunk;
var meshChunks = Voxel.meshChunks;
var merge = require('./merge');
var Mouse = require('./mouse');

module.exports = function(parent, blockMaterial, camera, colorPicker, terminal) {

  var self = {};

  var chunks = new Chunks();
  var colorIndex = 1;

  // x z
  var size = [16, 16, 16];
  var ground = require('./ground')(parent, size);
  var cursor = require('./cursor')(parent);
  cursor.object.visible = false;

  var cameraDistanceRatio = 1 / 50.0 * 80.0;
  var cameraControl = require('./cameracontrol')(camera);
  cameraControl.setDistance(calcCameraDis());

  var input = require('./input')(self);

  var object = new THREE.Object3D();
  var lastObject = new THREE.Object3D();

  var history = require('./history')(chunks);

  parent.add(object);

  colorPicker.onSelect = function(index) {
    colorIndex = index + 1;
  };

  function tick(dt) {
    cameraControl.tick(dt);

    meshChunks(chunks, object, blockMaterial);
  };

  function updateCursor(e) {
    var objects = [ground.getPlane(), lastObject];
    var collision = Mouse(e).getCollision(camera, objects);

    if (collision != null) {
      cursor.object.visible = true;
      var coordAbove = collision.coordAbove(camera);
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

    var coord = collision.coordAbove(camera);
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

    var coord = collision.coordBelow(camera);
    set(coord, 0);
  };

  function set(coord, v) {
    var lastV = chunks.get(coord.x, coord.y, coord.z);
    if (vEquals(lastV, v)) {
      return false;
    }
    chunks.set(coord.x, coord.y, coord.z, v);
    history.stage([coord.x, coord.y, coord.z, lastV, v]);
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
    history.commit();
  };

  function colorToVoxel(color) {
    return [color, color, color, color, color, color];
  };

  /**
   * @param {Args}
   */
  function setSize(args, terminal) {

    if (args._.length !== 3) {
      terminal.log('usage: size <i> <j> <k>');
      return;
    }
    size = args._;

    ground.setSize(size);

    cameraControl.setDistance(calcCameraDis());
  };

  function calcCameraDis() {
    var maxSize = Math.max(size[0], size[1], size[2]);
    return maxSize * cameraDistanceRatio * parent.scale.x;
  };

  terminal.commands['size'] = setSize;

  merge(self, {
    history: history,
    tick: tick,
    updateCursor: updateCursor,
    add: add,
    remove: remove,
    onFinishAdd: onFinishAdd,
    setSize: setSize
  });

  return self;
};
