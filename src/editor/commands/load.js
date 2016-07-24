module.exports = function(args, terminal) {
  var editor = terminal.global.editor;
  var server = terminal.global.server;
  var editable = editor.editable;

  var usage = 'usage: load <model id>\nload la <layer id>'
  if (args == null || args._.length !== 1) {
    if (terminal != null) terminal.log('usage: load id');
    return false;
  }

  // if (args._[0] === 'la') {
  //   var name = args._[1];

  //   server.loadLayer(name)
  //     .done(function(response) {
  //       var data = response.data;

  //     })
  //     .fail(function() {
  //       if (terminal != null) terminal.log('something went wrong');
  //     })
  //     .always(function() {
  //       if (terminal != null) terminal.resume();
  //     });

  //   return;
  // }

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
