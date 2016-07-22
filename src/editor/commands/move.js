module.exports = function(editor) {
  return function(args, terminal) {
    if (args == null || args._.length !== 3) {
      terminal.log('usage: move i j k');
      return;
    }

    var offset = [args._[0], args._[1], args._[2]];
    var chunks = editor.getChunks();
    var size = editor.getSize();

    var staging = [];
    chunks.visit(function(i, j, k, v) {
      var coord = [i + offset[0], j + offset[1], k + offset[2]];
      normalizeCoord(coord, size);
      staging.push([new THREE.Vector3().fromArray(coord), v]);
    });

    // Clear
    chunks.visit(function(i, j, k, v) {
      editor.set(new THREE.Vector3(i, j, k), 0);
    });

    staging.forEach(function(line) {
      editor.set(line[0], line[1]);
    });

    editor.onFinishAdd();
  };

  function normalizeCoord(coord, size) {
    coord[0] += size[0];
    coord[0] %= size[0];

    coord[1] += size[1];
    coord[1] %= size[1];

    coord[2] += size[2];
    coord[2] %= size[2];
    return coord;
  };
};
