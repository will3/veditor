var sinon = require('sinon');
var Input = require('../../editor/input');

describe('input', function() {
  var editor;
  beforeEach(function() {
    editor = {
      add: function() {},
      updateCursor: function() {}
    };
  });


  it('should add when mouse down', function() {
    var mock = sinon.mock(editor);
    var input = Input(mock.object);
    input.minStep = 1;
    mock.expects('add');
    input.onMouseDown({ button: 0, clientX: 0, clientY: 0 });
    mock.verify();
  });

  it('should add multiple time when dragging', function() {
    var mock = sinon.mock(editor);
    var input = Input(mock.object);
    input.minStep = 1;

    mock.expects('add').exactly(6);

    // add at [0, 0]
    input.onMouseDown({ button: 0, clientX: 0, clientY: 0 });
    // add at [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]
    input.onMouseMove({ clientX: 5, clientY: 0 });

    mock.verify();
  });

  it('should not add if moved too short', function() {
    var mock = sinon.mock(editor);
    var input = Input(mock.object);
    input.minStep = 1;

    mock.expects('add').once();

    // add at [0, 0]
    input.onMouseDown({ button: 0, clientX: 0, clientY: 0 });
    // should not add
    input.onMouseMove({ clientX: 0.99, clientY: 0 });

    mock.verify();
  });

  it('should not add if not moved much from last add', function() {
    var mock = sinon.mock(editor);
    var input = Input(mock.object);
    input.minStep = 1;

    mock.expects('add').once();

    // add at [0, 0]
    input.onMouseDown({ button: 0, clientX: 0, clientY: 0 });
    // should not add
    input.onMouseMove({ clientX: 0.99, clientY: 0 });
    // should not add
    input.onMouseMove({ clientX: -0.99, clientY: 0 });

    mock.verify();
  });

  it('should add if eventually moved enough', function() {
    var mock = sinon.mock(editor);
    var input = Input(mock.object);
    input.minStep = 1;

    mock.expects('add').twice(2);

    // add at [0, 0]
    input.onMouseDown({ button: 0, clientX: 0, clientY: 0 });
    // should not add
    input.onMouseMove({ clientX: 0.5, clientY: 0 });
    // should not add
    input.onMouseMove({ clientX: 1.0, clientY: 0 });

    mock.verify();
  });
});
