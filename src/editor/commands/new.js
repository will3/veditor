module.exports = function(editor) {
  return function(args, terminal) {
    terminal.global.name = null;
    editor.editable.clear();
    editor.editable.addLayer(0);
  };
};
