module.exports = function(editor) {
  return function() {
    name = null;
    var chunks = editor.getChunks();
    chunks.clear();
  };
};
