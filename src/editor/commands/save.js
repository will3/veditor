module.exports = function(args, terminal) {
  var editor = terminal.global.editor;
  var server = terminal.global.server;
  var editable = editor.editable;

  if (args._[0] != null) {
    editable.name = args._[0];
  }

  if (editable.name == null || editable.length === 0) {
    return terminal.log('must be named');
  }

  var body = {
    version: '1',
    data: editable.serialize()
  };

  terminal.pause();
  terminal.log('saving...');
  server.saveModel(body)
    .done(function() {
      var pref = editor.preferences.get();
      pref.lastLoaded = editable.name;
      editor.preferences.set(pref);
    })
    .fail(function() {
      return terminal.log('failed to save');
    })
    .always(function() {
      terminal.resume();
    });
};
