var THREE = require('three');

var Terminal = require('./terminal');
var ColorPicker = require('./colorpicker');

var terminal = Terminal();
document.body.appendChild(terminal.dom);

var argsTransform = function(args) {
  return require('minimist')(args.split(' '), {
    string: true
  });
};

terminal.argsTransform = argsTransform;

var palette = require('../lib/palette');
var colorPicker = ColorPicker({
  palette: palette
});
document.body.appendChild(colorPicker.dom);

var camera = new THREE.PerspectiveCamera(60,
  window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(50, 50, 50);
camera.lookAt(new THREE.Vector3());
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x222222);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var postprocessing = { enabled: true, renderMode: 0 }; // renderMode: 0('framebuffer'), 1('onlyAO')
var ssaoPass;
var depthMaterial, effectComposer, depthRenderTarget;

var entities = [];

window.addEventListener('resize', onWindowResize);

function render() {
  if (postprocessing.enabled) {
    // Render depth into depthRenderTarget
    scene.overrideMaterial = depthMaterial;
    renderer.render(scene, camera, depthRenderTarget, true);

    // Render renderPass and SSAO shaderPass
    scene.overrideMaterial = null;
    effectComposer.render();
  } else {
    renderer.render(scene, camera);
  }
};

function onWindowResize() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);

  // Resize renderTargets
  ssaoPass.uniforms['size'].value.set(width, height);

  var pixelRatio = renderer.getPixelRatio();
  var newWidth = Math.floor(width / pixelRatio) || 1;
  var newHeight = Math.floor(height / pixelRatio) || 1;
  depthRenderTarget.setSize(newWidth, newHeight);
  effectComposer.setSize(newWidth, newHeight);
};

function initPostprocessing() {

  // Setup render pass
  var renderPass = new THREE.RenderPass(scene, camera);

  // Setup depth pass
  depthMaterial = new THREE.MeshDepthMaterial();
  depthMaterial.depthPacking = THREE.RGBADepthPacking;
  depthMaterial.blending = THREE.NoBlending;

  var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
  depthRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, pars);

  // Setup SSAO pass
  ssaoPass = new THREE.ShaderPass(THREE.SSAOShader);
  ssaoPass.renderToScreen = true;
  //ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
  ssaoPass.uniforms["tDepth"].value = depthRenderTarget.texture;
  ssaoPass.uniforms['size'].value.set(window.innerWidth, window.innerHeight);
  ssaoPass.uniforms['cameraNear'].value = camera.near;
  ssaoPass.uniforms['cameraFar'].value = camera.far;
  ssaoPass.uniforms['onlyAO'].value = (postprocessing.renderMode == 1);
  ssaoPass.uniforms['aoClamp'].value = 0.3;
  ssaoPass.uniforms['lumInfluence'].value = 0.5;

  // Add pass to effect composer
  effectComposer = new THREE.EffectComposer(renderer);
  effectComposer.addPass(renderPass);
  effectComposer.addPass(ssaoPass);

};

var dt = 1 / 60;

function animate() {
  render();
  entities.forEach(function(entity) {
    entity.tick(dt);
  });
  requestAnimationFrame(animate);
};

var object = new THREE.Object3D();
scene.add(object);
var blockMaterials = require('../lib/blockmaterial')(palette);
var textureLoader = new THREE.TextureLoader();
var materials = {
  blockMaterial: blockMaterials[0],
  transparentMaterial: blockMaterials[1],
  cross: function() {
    var texture = textureLoader.load('textures/cross.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    });
  }()
};

var editor = require('./editor')(object, materials, camera, colorPicker, terminal);
entities.push(editor);

var ambientLight = new THREE.AmbientLight(0x888888);
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0.5, 1.0, 0.3);

scene.add(ambientLight);
scene.add(directionalLight);

initPostprocessing();
animate();
