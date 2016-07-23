module.exports = function(args, terminal) {
  var editor = terminal.global.editor;
  var editable = editor.editable;

  if (args != null && args._[0] != null) {
    var name = args._[0];
    editable.name = name;
    return;
  }

  terminal.log(editable.name == null ? 'not named' : editable.name);
};
