module.exports = function(palette) {
  var material = new THREE.MultiMaterial();
  material.materials = [null];
  var transparentMaterial = new THREE.MultiMaterial();
  transparentMaterial.materials = [null];

  palette.forEach(function(color) {
    var m = new THREE.MeshBasicMaterial({
      color: color
    });
    material.materials.push(m)

    m = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.2
    });
    transparentMaterial.materials.push(m);
  });

  return [material, transparentMaterial];
};
