module.exports = function(editor) {
  return function(args, terminal) {
    var server = terminal.global.server;
    terminal.pause();
    server.list(function(err, list) {
      terminal.resume();
      if (err) {
        return terminal.log('something went wrong');
      }

      list.forEach(function(item) {
        terminal.log(item);
      });
    });
  };
};
