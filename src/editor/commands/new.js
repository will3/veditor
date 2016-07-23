module.exports = function(args, terminal) {
  var editor = terminal.global.editor;
  editor.editable.clear();
  editor.editable.addLayer(0);
};
