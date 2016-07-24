var Api = require('../../../lib/api');

module.exports = function(editor, terminal) {
  var server = new Api();

  terminal.global.server = server;
  terminal.global.editor = editor;

  terminal.commands['size'] = editor.setSize;
  terminal.commands['save'] = require('./save');
  terminal.commands['ls'] = require('./list');
  terminal.commands['load'] = require('./load');
  terminal.commands['rm'] = require('./remove');
  terminal.commands['move'] = require('./move');
  terminal.commands['new'] = require('./new');
  terminal.commands['fr'] = require('./frame');
  terminal.commands['la'] = require('./layer');
  terminal.commands['name'] = require('./name');
  terminal.commands['ani'] = require('./animate');
};
