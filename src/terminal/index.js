var terminal = function() {
  var promptText = '> ';
  var logsStore = [];
  var logs = [];
  var logsLines = 200;
  var entered = [];
  var enteredIndex = 0;
  var toggleKey = 192;

  var messages = {
    commandNotFound: function(command) {
      return command + ': command not found'
    }
  };

  var commands = {};

  var dom = document.createElement('div');
  dom.classList.add('terminal-root');
  dom.style.visibility = 'hidden';

  var inputDom = document.createElement('textarea');
  inputDom.classList.add('terminal-input');
  inputDom.classList.add('terminal-text');
  inputDom.classList.add('terminal-textarea');

  inputDom.cols = 80;
  inputDom.rows = 24;
  inputDom.type = 'text';
  inputDom.value = promptText;
  dom.appendChild(inputDom);

  dom.addEventListener('keydown', onKeyDown);

  window.addEventListener('keydown', onGlobalKeyDown);

  function onGlobalKeyDown(e) {
    var key = e.keyCode || e.charCode;
    if (key === toggleKey) {
      dom.style.visibility = dom.style.visibility === 'hidden' ?
        'visible' :
        'hidden';

      if (dom.style.visibility === 'visible') {
        inputDom.focus();
        moveCaretToEnd();
      }

      e.preventDefault();
      e.stopPropagation();
    }
  };

  function onKeyDown(e) {
    // Check if caret if before last prompt, if so move caret to end and prevent key
    var promptIndex = inputDom.value.lastIndexOf(promptText) + promptText.length;
    if (inputDom.selectionStart < promptIndex) {
      moveCaretToEnd();
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (paused) {
      e.preventDefault();
      return;
    }

    var key = e.keyCode || e.charCode;

    if (key === 13) {
      // Enter pressed
      onEnterPressed();
      e.preventDefault();
    } else if (key === 8 || key === 46) {
      // Back space pressed
      var lastLine = getLastLine();
      if (lastLine.length <= promptText.length) {
        e.preventDefault();
      }
    } else if (key === 38) {
      // Up pressed
      e.preventDefault();

      if (entered.length > 0) {
        inputDom.value = getLogs() + '\n' + promptText + entered[enteredIndex];
        enteredIndex--;
        if (enteredIndex < 0) {
          enteredIndex = entered.length - 1;
        }
      }
    } else if (key === 40) {
      // Down pressed
      e.preventDefault();

      if (entered.length > 0) {
        inputDom.value = getLogs() + '\n' + promptText + entered[enteredIndex];
        enteredIndex++;
        if (enteredIndex > entered.length - 1) {
          enteredIndex = 0;
        }
      }
    }

    if (key === toggleKey) {
      e.preventDefault();
      return;
    }

    e.stopPropagation();
    return false;
  }

  function onEnterPressed() {
    var lastLine = getLastLine();
    value = lastLine.substring(promptText.length);
    value = value.trim();
    if (value.length === 0) {
      // Entered empty
      log(lastLine);
      return;
    }

    entered.push(value);
    enteredIndex = entered.length - 1;

    // Extract args, if any
    var spaceIndex = value.indexOf(' ');
    var args = null;
    var command = value;
    if (spaceIndex != -1) {
      command = value.substring(0, spaceIndex);
      args = value.substring(spaceIndex + 1);
      if (self.argsTransform != null) {
        args = self.argsTransform(args);
      }
    }

    // No command found
    if (commands[command] == null) {
      log(lastLine);
      log(messages.commandNotFound(command));
      return;
    }

    try {
      log(lastLine);
      commands[command](args, self);
    } catch (e) {
      paused = false;
      log(lastLine);
      log(e);
      updateLogs();
    }
  };

  function log(messages) {
    messages = messages instanceof Error ?
      messages.stack.split('\n') :
      Array.isArray(messages) ?
      messages : [messages];

    logs = logs.concat(messages);
    updateLogs();
    inputDom.scrollTop = inputDom.scrollHeight;
  };

  function clear() {
    logsStore = logsStore.concat(logs);
    logs = [];
    updateLogs();
  };

  function updateLogs() {
    var text = formatLogs();
    if (!paused) {
      text += promptText;
    }
    inputDom.value = text;
  };

  function getLastLine() {
    var values = inputDom.value.split('\n');
    return values[values.length - 1];
  };

  function getLogs() {
    var values = inputDom.value.split('\n');
    values.pop();
    return values.join('\n');
  };

  function formatLogs() {
    var text = '';

    var startIndex = 0;
    if (logs.length > logsLines) {
      startIndex = logs.length - logsLines;
    }

    for (var i = startIndex; i < logs.length; i++) {
      text += logs[i];
      text += '\n';
    }
    return text;
  };

  function moveCaretToEnd() {
    inputDom.selectionStart = inputDom.selectionEnd = inputDom.value.length * 2;
  };

  var paused = false;

  function pause() {
    paused = true;
  };

  function resume() {
    paused = false;
    updateLogs();
  };

  commands.clear = clear;

  var self = {
    global: {},
    clear: clear,
    log: log,
    pause: pause,
    resume: resume,

    commands: commands,
    dom: dom,
    argsTransform: null
  };

  return self;
};

module.exports = terminal;
