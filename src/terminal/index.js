var terminal = function() {
  var promptText = '> ';

  var logsStore = [];
  var logs = [];

  var logsLines = 15;

  var dom = document.createElement('div');
  dom.classList.add('terminal-root');

  var logDom = document.createElement('pre');
  logDom.classList.add('terminal-log');
  logDom.classList.add('terminal-pre');
  logDom.classList.add('terminal-text');
  dom.appendChild(logDom);

  var inputDom = document.createElement('input');
  inputDom.classList.add('terminal-input');
  inputDom.classList.add('terminal-text');
  inputDom.type = 'text';
  inputDom.value = promptText;
  dom.appendChild(inputDom);

  dom.addEventListener('keydown', function(e) {
    var key = e.keyCode || e.charCode;

    if (key === 13) {
      onEnterPressed();
    }

    e.stopPropagation();
    return false;
  });

  inputDom.addEventListener('input', function(e) {
    var promptIndex;
    promptIndex = inputDom.value.indexOf(promptText);
    if (promptIndex !== 0) {
      inputDom.value = promptText;
      e.preventDefault();
    }
  });

  function onEnterPressed() {
    var value = inputDom.value.substring(promptText.length);
    if (value.trim().length === 0) {
      // Entered empty
    }

    var spaceIndex = value.indexOf(' ');
    var param = null;
    var command = value;
    if (spaceIndex != -1) {
      command = value.substring(0, spaceIndex);
      param = value.substring(spaceIndex + 1);
    }

    if (commands[command] == null) {
      log(messages.commandNotFound(command));
      return;
    }

    try {
      var result = commands[command](param);
    } catch (e) {
      log(e);
      updateLogsDom();
    }
  };

  function log(messages) {
    messages = messages instanceof Error ?
      messages.stack.split('\n') :
      Array.isArray(messages) ?
      messages : [messages];

    if (inputDom.value.trim().length > 0) {
      logs.push(inputDom.value);
    }
    logs = logs.concat(messages);
    updateLogsDom();
  };

  function clear() {
    logsStore = logsStore.concat(logs);
    logs = [];
    updateLogsDom();
  };

  function updateLogsDom() {
    var text = '';

    var startIndex = 0;
    if (logs.length > logsLines) {
      startIndex = logs.length - logsLines;
    }

    for (var i = startIndex; i < logs.length; i++) {
      text += logs[i];
      text += '<br />';
    }

    logDom.innerHTML = text;
    inputDom.value = promptText;
  };

  var messages = {
    commandNotFound: function(command) {
      return command + ': command not found'
    }
  };

  var commands = { clear: clear };

  commands.test = function() {
    throw new Error('a error message');
  };

  var self = {
    commands: commands,
    dom: dom
  };

  return self;
};

module.exports = terminal;
