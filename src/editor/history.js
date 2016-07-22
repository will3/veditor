module.exports = function(chunks) {

  var undos = [];
  var redos = [];

  var staging = [];

  /**
   * Stage a pending change
   * @param  {Array} data array with elements [i, j, k, last value, value]
   */
  function stage(item) {
    staging.push(item);
  };

  /**
   * Commit all staged changes, this will add it to undos
   */
  function commit() {
    if (staging.length === 0) {
      return;
    }
    undos.push(staging);
    staging = [];
    redos = [];
  };

  function undo() {
    if (undos.length === 0) {
      return;
    }

    var data = undos.pop();
    for(var i = data.length - 1; i >= 0; i--) {
      var item = data[i];
      chunks.set(item[0], item[1], item[2], item[3]);
    }
    redos.push(data);
  };

  function redo() {
    if (redos.length === 0) {
      return;
    }

    var data = redos.pop();
    data.forEach(function(item) {
      chunks.set(item[0], item[1], item[2], item[4]);
    });
    undos.push(data);
  };

  return {
    stage: stage,
    commit: commit,
    undo: undo,
    redo: redo
  };
};
