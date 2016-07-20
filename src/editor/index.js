var Voxel = require('voxel');
var Chunks = Voxel.Chunks;
var Chunk = Voxel.Chunk;
var meshChunks = Voxel.meshChunks;
var merge = require('./merge');
var Mouse = require('./mouse');

module.exports = function(parent, blockMaterial, camera) {

  var self = {};

  var chunks = new Chunks();
  var colorIndex = 1;

  var size = 50;
  var ground = require('./ground')(parent, size);
  var cursor = require('./cursor')(parent);
  cursor.object.visible = false;

  var cameraControl = require('./cameracontrol')(camera);

  var input = require('./input')(self);

  var object = new THREE.Object3D();
  var lastObject = new THREE.Object3D();

  parent.add(object);

  function tick(dt) {
    cameraControl.tick(dt);

    meshChunks(chunks, object, blockMaterial);
  };

  function updateCursor(e) {
    var objects = [ground.plane, lastObject];
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
    var objects = [ground.plane, lastObject];
    var collision = Mouse(e).getCollision(camera, objects);

    if (collision == null) {
      return;
    }

    var coord = collision.coordAbove(camera);
    chunks.set(coord.x, coord.y, coord.z, colorToVoxel(colorIndex));
  };

  function onFinishAdd() {
    lastObject = object.clone();
  };

  function colorToVoxel(color) {
    return [color, color, color, color, color, color];
  };

  merge(self, {
    tick: tick,
    updateCursor: updateCursor,
    add: add,
    onFinishAdd: onFinishAdd
  });

  return self;
};
