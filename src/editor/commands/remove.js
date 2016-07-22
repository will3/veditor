module.exports = function(editor) {
  return function(args, terminal) {
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

    server.remove(id, function(err) {
      terminal.resume();
      if (err) {
        return terminal.log('something went wrong');
      }
    });
  };
};
