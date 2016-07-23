module.exports = function(args, terminal) {
  var editor = terminal.global.editor;
  var server = terminal.global.server;
  var editable = editor.editable;

  if (editable.name == null || editable.length === 0) {
    return terminal.log('must be named');
  }

  var body = {
    version: '1',
    data: editable.serialize()
  };

  terminal.pause();
  terminal.log('saving...');
  server.save(body, function(err) {
    terminal.resume();
    if (err) {
      return terminal.log('failed to save');
    }

    var pref = editor.preferences.get();
    pref.lastLoaded = editable.name;
    editor.preferences.set(pref);
  });
};
