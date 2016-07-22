module.exports = function(editor) {
  return function(args, terminal) {
    var editable = editor.editable;
    if (editable.getFrames == null) {
      terminal.log('object doesn\'t have frames!');
      return;
    }

    if (args == null) {
      logFrameStatus(terminal);
      return;
    }

    if (args._[0] === 'add') {
      editable.addFrame();
      logFrameStatus(terminal);
      return;
    }

    if (args._[0] === 'next') {
      editable.nextFrame();
      logFrameStatus(terminal);
      return;
    }

    if (args._[0] === 'prev') {
      editable.lastFrame();
      logFrameStatus(terminal);
      return;
    }

    if (args._[0] === 'remove') {
      if (args._[1] == null) {
        terminal.log('try frame remove <index>');
        return;
      }

      var index = args._[1];
      editable.removeFrame(index);
      logFrameStatus(terminal);
    }
  };

  function logFrameStatus(terminal) {
    var editable = editor.editable;
    terminal.log((editable.frameIndex + 1) + ' / ' + editable.getFrames().length);
  };
};
