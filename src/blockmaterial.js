module.exports = function() {
  var palette = [0xffffff];

  var material = new THREE.MultiMaterial();
  material.materials = [null];

  palette.forEach(function(color) {
    var m = new THREE.MeshBasicMaterial({
      color: color
    });
    material.materials.push(m)
  });

  return material;
};
