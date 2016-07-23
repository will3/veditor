var Api = require('../../../lib/api');

module.exports = function(editor, terminal) {
  var server = new Api();

  terminal.global.server = server;
  terminal.global.name = null;

  terminal.commands['size'] = editor.setSize;
  terminal.commands['save'] = require('./save')(editor);
  terminal.commands['ls'] = require('./list')(editor);
  terminal.commands['load'] = require('./load')(editor);
  terminal.commands['rm'] = require('./remove')(editor);
  terminal.commands['move'] = require('./move')(editor);
  terminal.commands['new'] = require('./new')(editor);
  terminal.commands['fr'] = require('./frame')(editor);
  terminal.commands['la'] = require('./layer')(editor);
};
