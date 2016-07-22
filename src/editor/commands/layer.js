module.exports = function(editor) {
  var layerNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return function(args, terminal) {
    var editable = editor.editable;

    if (editable.getLayers == null) {
      terminal.log('object doesn\'t have layers!');
      return;
    }

    if (args == null) {
      logLayersStatus(terminal);
      return;
    }

    if (args._[0] === 'add') {
      if (args._[1] == null) {
        terminal.log('try la add <layer>');
        return;
      }

      var layerIndex = args._[1];
      if (!isLayerIndex(layerIndex)) {
        terminal.log('layer must be [0-9]');
        return;
      }

      editable.addLayer(layerIndex);
      editable.setLayerIndex(layerIndex);
      logLayersStatus(terminal);
      return;
    }

    if (args._[0] === 'remove') {
      if (args._[1] == null) {
        terminal.log('try la remove <layer>');
        return;
      }
      var layerIndex = args._[1];
      if (!isLayerIndex(layerIndex)) {
        terminal.log('layer must be [0-9]');
        return;
      }

      if (!args.f) {
        terminal.log('use -f to confirm');
        return;
      }

      // Select first available index if removing selected layer
      if (layerIndex === editable.getLayerIndex()) {
        for (var i = 0; i < layerNumbers.length; i++) {
          var index = layerNumbers[i];
          if (parseInt(index) !== layerIndex) {
            editable.setLayerIndex(parseInt(index));
          }
        }
      }
      editable.removeLayer(layerIndex);
      logLayersStatus(terminal);
      return;
    }

    if (args._[0] === 'mode') {
      editable.setLayerMode(editable.getLayerMode() === 0 ? 1 : 0);
      logLayersStatus(terminal);
      return;
    }

    if (args._[0] === 'copy') {
      var toIndex = args._[1];
      if (!isLayerIndex(toIndex)) {
        terminal.log('layer must be [0-9]');
        return;
      }

      var layer = editable.getLayers()[toIndex];
      if (layer == null) {
        layer = editable.addLayer(toIndex);
      }

      layer.copy(editable.getCurrentLayer());

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

    if (isLayerIndex(args._[0])) {
      var layerIndex = args._[0];
      editable.setLayerIndex(layerIndex);
      logLayersStatus(terminal);
      return;
    }

    terminal.log('usage: la add <layer>\n' +
      'la remove <layer>\n' +
      'la <layer>');
  };

  function logLayersStatus(terminal) {
    var editable = editor.editable;

    var lines = [];
    var layers = editable.getLayers();

    for (var i = 0; i < layerNumbers.length; i++) {
      var index = layerNumbers[i];
      var layer = layers[index];

      if (layer == null) {
        continue;
      }

      var name = layer.name || 'unnamed';
      if (parseInt(index) === editable.getLayerIndex()) {
        lines.push(index + '* ' + name);
      } else {
        lines.push(index + '  ' + name);
      }
    }

    var text = lines.join('\n');
    terminal.log(text);
  };

  function isLayerIndex(value) {
    for (var i = 0; i < layerNumbers.length; i++) {
      if (value === layerNumbers[i] ||
        value === parseInt(layerNumbers[i])) {
        return true;
      }
    }
    return false;
  };
};
