var Animation = require('../../../lib/editable/animation');

module.exports = function(args, terminal) {
  var editor = terminal.global.editor;
  var server = terminal.global.server;
  var editable = editor.editable;

  var tempMap = {};

  // Assign temp id;
  var count = 0;
  for (var i = 0; i < editable.layers.length; i++) {
    var layer = editable.layers[i];
    if (layer.animations.length === 0) {
      continue;
    }

    for (var j = 0; j < layer.animations.length; j++) {
      var animation = layer.animations[j];
      animation._tempId = count;
      var temp = {
        animation: animation,
        index: j,
        layer: layer
      };
      tempMap[animation._tempId] = temp;
      if(tempMap[animation.name] == null) {
        tempMap[animation.name] = temp;
      }
      count++;
    }
  }

  if (args == null) {
    logStatus();
    return;
  }

  if (args._[0] === 'rm') {
    if (args._[1] == null) {
      logUsage();
      return;
    }

    var temp = tempMap[args._[1]];
    if (temp == null) {
      console.log('animation ' + temp.index + 'doesn\'t exist');
      return;
    }

    temp.layer.animations.splice(temp.index, 1);
    logStatus();
    return;
  }

  if (args._[0] === 'add') {
    if (args._[1] == null) {
      logUsage();
      return;
    }

    var name = args._[1];

    var animation = new Animation();

    var framesCount = editable.getFrames().length;

    if (args.s == null) {
      var sequence = [];
      for (var i = 0; i < framesCount; i++) {
        sequence.push(i);
      }
      animation.sequence = sequence;
    } else {
      animation.sequence = parseIntArray(args.s);
    }

    animation.name = args._[1];
    animation.layer = editable.getCurrentLayer().name;

    if (args.i != null) {
      animation.frameIntervals = parseFloatArray(args.i);
    }

    if (args.d != null) {
      animation.defaultFrameInterval = args.d;
    }

    if (args.t != null) {
      animation.times = args.t;
    }

    animation.times = 1;

    editable.getCurrentLayer().animations.push(animation);

    return;
  };

  if (args._[0] === 'play') {
    if (args._[1] == null) {
      logUsage();
      return;
    }

    var indexes = (args._[1] + '').split(',');

    for (var i = 0; i < indexes.length; i++) {
      var index = indexes[i];
      if (tempMap[index] == null) {
        terminal.log('animation ' + index + ' doesn\'t exist');
        return;
      }
      var animation = tempMap[index].animation;
      var t = args.t == null ? '*' : args.t;
      animation.times = t;
    }

    return;
  };

  if (args._[0] === 'stop') {
    for (var i in tempMap) {
      var animation = tempMap[i].animation;
      if (animation.times !== 0) {
        animation.times = 1;
      }
    }
    return;
  }

  logUsage();

  function logUsage() {
    terminal.log('usage: ani add <name> [options]\n' +
      'ani play <name> <times>');
  }

  function parseFloatArray(text) {
    var parts = text.split(',');
    for (var i = 0; i < parts.length; i++) {
      parts[i] = parseFloat(parts[i]);
    }
    return parts;
  };

  function parseIntArray(text) {
    var parts = text.split(',');
    for (var i = 0; i < parts.length; i++) {
      parts[i] = parseInt(parts[i]);
    }
    return parts;
  };

  function logStatus() {
    for (var i = 0; i < editable.layers.length; i++) {
      var layer = editable.layers[i];
      if (layer.animations.length === 0) {
        continue;
      }

      terminal.log('-- ' + layer.name + ' --');
      for (var j = 0; j < layer.animations.length; j++) {
        var animation = layer.animations[j];
        terminal.log(animation._tempId + ': ' + animation.name);
      }
    }
  };
};
