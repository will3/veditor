module.exports = function(args, terminal) {
  var editor = terminal.global.editor;
  var server = terminal.global.server;
  if (args == null || args._.length !== 1) {
    terminal.log('usage: rm id [options]');
    return;
  }

  if (args.f !== true) {
    terminal.log('use -f to confirm');
    return;
  }

  var id = args._[0];
  terminal.pause();

  server.removeModel(id)
    .done(function() {})
    .fail(function() {
      return terminal.log('something went wrong');
    })
    .always(function() {
      terminal.resume();
    });
};
