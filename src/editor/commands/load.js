module.exports = function(editor) {
  return function(args, terminal) {
    var server = terminal.global.server;
    var editable = editor.editable;

    if (args == null || args._.length !== 1) {
      if (terminal != null) terminal.log('usage: load id');
      return false;
    }

    var id = args._[0];
    if (terminal != null) terminal.pause();

    server.load(id, function(err, response) {
      if (terminal != null) terminal.resume();
      if (err) {
        if (terminal != null) terminal.log('something went wrong');
        return false;
      }

      var data = response.data;
      var name = response.name;
      // Save name
      terminal.global.name = name;
      var pref = editor.preferences.get();
      pref.lastLoaded = name;
      editor.preferences.set(pref);
      editable.deserialize(data);
    });
  };
};
