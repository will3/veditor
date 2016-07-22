module.exports = function() {
  var key = 'veditor-preferences';

  function get() {
    var localStorage = window.localStorage;
    var result = localStorage.getItem(key);
    if (result == null) {
      set({});
      return {};
    }

    try {
      return JSON.parse(result);
    } catch (e) {
      console.log('failed to load preferences');
      set({});
      return {};
    }
  };

  function set(value) {
    var localStorage = window.localStorage;
    localStorage.setItem(key, JSON.stringify(value));
  };

  return {
    get: get,
    set: set
  };
};
