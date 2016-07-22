module.exports = function(editor, terminal) {
  var server = require('./server')();
  var name = null;

  terminal.commands['size'] = editor.setSize;
  terminal.commands['save'] = save;
  terminal.commands['list'] = list;
  terminal.commands['ls'] = list;
  terminal.commands['load'] = load;
  terminal.commands['remove'] = remove;
  terminal.commands['rm'] = remove;
  terminal.commands['move'] = move;
  terminal.commands['new'] = createNew;

  function save(args, terminal) {
    var chunks = editor.getChunks();
    if (args != null && args._.length > 0) {
      name = args._[0];
    }

    if (name == null) {
      return terminal.log('usage: save [name]');
    }

    var body = {
      version: '1',
      data: chunks.serialize(),
      name: name
    };

    terminal.pause();
    terminal.log('saving...');
    server.save(body, function(err) {
      terminal.resume();
      if (err) {
        return terminal.log('failed to save');
      }
    });

    var pref = editor.preferences.get();
    pref.lastLoaded = name;
    editor.preferences.set(pref);
  };

  function list(args, terminal) {
    terminal.pause();
    server.list(function(err, list) {
      terminal.resume();
      if (err) {
        return terminal.log('something went wrong');
      }

      list.forEach(function(item) {
        terminal.log(item);
      });
    });
  };

  function load(args, terminal) {
    var chunks = editor.getChunks();
    if (args == null || args._.length !== 1) {
      if (terminal != null) terminal.log('usage: load id');
      return false;
    }

    var id = args._[0];
    if (terminal != null) terminal.pause();

    server.load(id, function(err, response) {
      if (terminal != null) terminal.resume();
      if (err) {
        if (terminal != null) terminal.log('something went wrong');
        return false;
      }

      var data = response.data;
      name = response.name;
      var pref = editor.preferences.get();
      pref.lastLoaded = name;
      editor.preferences.set(pref);
      chunks.clear().deserialize(data);
    });
  };

  function remove(args, terminal) {
    if (args == null || args._.length !== 1) {
      terminal.log('usage: rm id [options]');
      return;
    }

    if (args.f !== true) {
      terminal.log('use -f to confirm');
      return;
    }

    var id = args._[0];
    terminal.pause();

    server.remove(id, function(err) {
      terminal.resume();
      if (err) {
        return terminal.log('something went wrong');
      }
    });
  };

  function move(args, terminal) {
    if (args == null || args._.length !== 3) {
      terminal.log('usage: move i j k');
      return;
    }

    var offset = [args._[0], args._[1], args._[2]];
    var chunks = editor.getChunks();
    var size = editor.getSize();

    var staging = [];
    chunks.visit(function(i, j, k, v) {
      var coord = [i + offset[0], j + offset[1], k + offset[2]];
      normalizeCoord(coord, size);
      staging.push([new THREE.Vector3().fromArray(coord), v]);
    });

    // Clear
    chunks.visit(function(i, j, k, v) {
      editor.set(new THREE.Vector3(i, j, k), 0);
    });

    staging.forEach(function(line) {
      editor.set(line[0], line[1]);
    });

    editor.onFinishAdd();
  };

  function createNew() {
    name = null;
    var chunks = editor.getChunks();
    chunks.clear();
  };

  function normalizeCoord(coord, size) {
    coord[0] += size[0];
    coord[0] %= size[0];

    coord[1] += size[1];
    coord[1] %= size[1];

    coord[2] += size[2];
    coord[2] %= size[2];
    return coord;
  };
};
