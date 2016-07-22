module.exports = function(editor, terminal) {
  return function(args, terminal) {
    var name = terminal.global.name;
    var server = terminal.global.server;

    var editable = editor.editable;
    if (args != null && args._.length > 0) {
      name = args._[0];
    }

    if (name == null) {
      return terminal.log('usage: save [name]');
    }

    var body = {
      version: '1',
      data: editable.serialize(),
      name: name
    };

    terminal.pause();
    terminal.log('saving...');
    server.save(body, function(err) {
      terminal.resume();
      if (err) {
        return terminal.log('failed to save');
      }
    });

    var pref = editor.preferences.get();
    pref.lastLoaded = name;
    editor.preferences.set(pref);
  };
};
