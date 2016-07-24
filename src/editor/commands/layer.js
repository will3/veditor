var layerNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

module.exports = function(args, terminal) {
  var editor = terminal.global.editor;
  var editable = editor.editable;
  var server = terminal.global.server;

  if (editable.getLayers == null) {
    terminal.log('object doesn\'t have layers!');
    return;
  }

  if (args == null) {
    logLayersStatus(terminal);
    return;
  }

  if (args._[0] === 'add') {
    var layer = editable.addLayer();
    var name = args._[1];
    if (name != null) {
      layer.name = name;
    }
    editable.setLayerIndex(editable.layers.length - 1);
    logLayersStatus(terminal);
    return;
  }

  if (args._[0] === 'rm') {
    if (args._[1] == null) {
      terminal.log('try la rm <index>');
      return;
    }
    var index = parseIndex(args._[1]);

    if (index === editable.layerIndex) {
      terminal.log('cannot remove current active layer');
      return;
    }

    if (!args.f) {
      terminal.log('use -f to confirm');
      return;
    }

    editable.removeLayer(index);
    logLayersStatus(terminal);
    return;
  }

  if (args._[0] === 'copy') {
    var index = parseIndex(args._[1]);

    if (index == null) {
      terminal.log('try la copy <index>');
    }

    var layer = editable.getLayers()[index];
    if (layer == null) {
      terminal.log('layer ' + args._[1] + ' not found');
    }

    editable.getCurrentLayer().copy(layer);
    editable.getCurrentLayer().name = (layer.name || '') + '_copy';

    return;
  }

  if (args._[0] === 'name') {
    if (args._[1] == null) {
      terminal.log('try la name <name>');
      return;
    }
    editable.getCurrentLayer().name = args._[1];
    logLayersStatus(terminal);
    return;
  }

  if (args._[0] === 'load') {
    var layer = editable.getCurrentLayer();
    var name = args._[1] || layer.name;

    if (layer.name != null && args._[1] !== layer.name) {
      if (!args.f) {
        terminal.log('layer name mismatch, use -f to confirm');
        return;
      }
    }

    if (layer.name == null) {
      layer.name = name;
    }

    server.loadLayer(name)
      .done(function(response) {
        layer.deserialize(response.data);
        // Workaround for some data stored without name
        layer.name = name;
      })
      .catch(function(err) {
        terminal.log('something went wrong, does the layer exist?');
      })
      .always(function() {
        terminal.resume();
      });

    logLayersStatus(terminal);
    return;
  }

  if (args._[0] === 'save') {
    terminal.log('saving layer...');
    var layer = editable.getCurrentLayer();
    var name = args._[1] || layer.name;

    if (name == null) {
      terminal.log('try la save <name>');
      return;
    }

    layer.name = name;

    terminal.pause();
    server.saveLayer(layer)
      .done(function() {
        terminal.resume();
      })
      .catch(function(err) {
        terminal.log('something went wrong');
      })
      .always(function() {
        terminal.resume()
      });

    logLayersStatus(terminal);
    return;
  }

  if (args._[0] === 'select') {
    var index = parseIndex(args._[1]);
    if (editable.getLayers()[index] == null) {
      terminal.log('layer ' + args._[1] + ' doesn\'t exist');
      return;
    }

    editable.setLayerIndex(index);
    logLayersStatus(terminal);
    return;
  }

  terminal.log(
    'usage: la add <layer>\n' +
    'la rm <layer>\n' +
    'la select <layer>\n' +
    'la copy <index>' +
    'la name <name>');

  function parseIndex(number) {
    return number - 1;
  };

  function logLayersStatus() {
    var editable = editor.editable;

    var lines = [];
    var layers = editable.getLayers();

    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i];
      // Index starts at 1
      var status = (i + 1) + ' ' + (layer.name || '<unnamed>');
      if (i === editable.layerIndex) {
        status += ' *';
      }
      lines.push(status);
    }

    var text = lines.join('\n');
    terminal.log(text);
  };
};
