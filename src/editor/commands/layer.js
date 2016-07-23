var layerNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

module.exports = function(args, terminal) {
  var editor = terminal.global.editor;
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
      terminal.log('try la add <name>');
      return;
    }

    var name = args._[1];

    editable.addLayer(name);
    editable.setActiveLayerName(name);
    logLayersStatus(terminal);
    return;
  }

  if (args._[0] === 'remove') {
    if (args._[1] == null) {
      terminal.log('try la remove <layer>');
      return;
    }
    var name = args._[1] + '';

    if (name === editable.activeLayerName) {
      terminal.log('cannot remove current active layer');
      return;
    }

    if (!args.f) {
      terminal.log('use -f to confirm');
      return;
    }

    editable.removeLayer(name);
    logLayersStatus(terminal);
    return;
  }

  if (args._[0] === 'mode') {
    editable.setLayerMode(editable.getLayerMode() === 0 ? 1 : 0);
    logLayersStatus(terminal);
    return;
  }

  if (args._[0] === 'copy') {
    var name = args._[1];

    var layer = editable.getLayers()[name];
    if (layer == null) {
      terminal.log('layer ' + name + ' not found');
    }

    editable.getCurrentLayer().copy(layer);
    editable.getCurrentLayer().name = layer.name + '_copy';

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

  if (args._[0] === 'select') {
    if (args._[1] == null) {
      terminal.log('try la select <name>');
      return;
    }

    var name = args._[1];
    if (editable.getLayers()[name] == null) {
      terminal.log('layer ' + name + ' doesn\'t exist');
    }

    editable.setActiveLayerName(name);
    logLayersStatus(terminal);
    return;
  }

  terminal.log('usage: la add <layer>\n' +
    'la remove <layer>\n' +
    'la <layer>');

  function logLayersStatus() {
    var editable = editor.editable;

    var lines = [];
    var layers = editable.getLayers();

    var count = 1;
    for (var name in layers) {
      if (name === editable.activeLayerName) {
        lines.push(count + ' ' + name + '* ');
      } else {
        lines.push(count + ' ' + name);
      }
      count++;
    }

    var text = lines.join('\n');
    terminal.log(text);
  };
};
