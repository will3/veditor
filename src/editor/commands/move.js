module.exports = function(args, terminal) {
  var editor = terminal.global.editor;
  if (args == null || args._.length !== 3) {
    terminal.log('usage: move i j k');
    return;
  }

  var offset = new THREE.Vector3(args._[0], args._[1], args._[2]);
  editor.move(offset);
};
