module.exports = function(args, terminal) {
  var editor = terminal.global.editor;
  var server = terminal.global.server;
  var editable = editor.editable;

  if (args == null || args._.length !== 1) {
    if (terminal != null) terminal.log('usage: load id');
    return false;
  }

  var id = args._[0];
  if (terminal != null) terminal.pause();

  server.loadModel(id)
    .done(function(response) {
      var data = response.data;
      editable.deserialize(data);
      // Save last loaded
      var pref = editor.preferences.get();
      pref.lastLoaded = editable.name;
      editor.preferences.set(pref);
    })
    .fail(function() {
      if (terminal != null) terminal.log('something went wrong');
    })
    .always(function() {
      if (terminal != null) terminal.resume();
    });
};
