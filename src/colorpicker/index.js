module.exports = function(opts) {
  opts = opts || {};

  var self = {};

  var onSelect = opts.onSelect || function() {};
  var palette = require('./palette');
  var cols = 4;
  var colorIndex = 0;

  var blockWidth = 24;
  var blockHeight = 24;
  var highlightOffset = { x: -1, y: -1 };

  var dom = document.createElement('div');
  dom.classList.add('colorpicker-root');

  var index = 0;
  palette.forEach(function(color) {
    var blockDom = document.createElement('div');
    blockDom.style.backgroundColor = color;
    blockDom.classList.add('colorpicker-block');
    dom.appendChild(blockDom);
    blockDom.addEventListener('mousedown', getOnMouseDown(index));

    index++;
  });

  var selectDom = document.createElement('div');
  selectDom.classList.add('colorpicker-select');
  dom.appendChild(selectDom);

  select(colorIndex);

  function getOnMouseDown(index) {
    return function(e) {
      select(index);
      self.onSelect(index);
    };
  };

  function select(index) {
    var pos = getPos(index);
    selectDom.style.left = pos.x + highlightOffset.x + 'px';
    selectDom.style.top = pos.y + highlightOffset.y + 'px';
  };

  function getPos(index) {
    var row = getRow(index);
    var col = getCol(index);

    return {
      x: col * blockWidth,
      y: row * blockHeight
    };
  };

  function getCol(index) {
    return index % cols;
  };

  function getRow(index) {
    return Math.floor(index / cols);
  };

  var extended = {
    dom: dom,
    palette: palette,
    onSelect: onSelect
  };

  // Extend
  for (var i in extended) {
    self[i] = extended[i];
  }

  return self;
};
