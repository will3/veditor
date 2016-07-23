module.exports = function(args, terminal) {
  var editor = terminal.global.editor;
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
    editable.setFrameIndex(editable.getFrameIndex() + 1);
    logFrameStatus(terminal);
    return;
  }

  if (args._[0] === 'next') {
    editable.setFrameIndex(editable.getFrameIndex() + 1);
    logFrameStatus(terminal);
    return;
  }

  if (args._[0] === 'prev') {
    editable.setFrameIndex(editable.getFrameIndex() - 1);
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
    return;
  }

  if (args._[0] === 'copy') {
    if (args._[1] == null) {
      terminal.log('try frame copy <index>');
      return;
    }

    var index = args._[1];
    var currentFrame = editable.getCurrentFrame();
    currentFrame.copy(editable.getFrames()[index]);
    logFrameStatus(terminal);
    return;
  }
  terminal.log('usage: fr add\nfr next\nfr prev\nfr remove <index>');

  function logFrameStatus() {
    var editable = editor.editable;
    terminal.log(editable.getFrameIndex() + ' / ' + (editable.getFrames().length - 1));
  };
};
