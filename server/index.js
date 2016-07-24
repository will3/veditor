var express = require('express');
var app = express();
var libPath = require('path');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var _ = require('lodash');

var paths = require('./paths');

Promise.promisifyAll(require('fs-extra'));

app.use(bodyParser.json());

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/textures', express.static('textures'));

app.get('/', function(req, res) {
  res.sendFile(libPath.join(__dirname, '/../index.html'));
});

var modelController = require('./controllers/store')({
  getId: 'name',
  rootDir: paths.models
}).toController();

var layerStore = require('./controllers/store')({
  getId: 'name',
  rootDir: paths.layers
});
var layerController = layerStore.toController();

var animationStore = require('./controllers/store')({
  getId: 'name',
  rootDir: paths.animations
});
var animationController = animationStore.toController();

app.post('/model', modelController.save);
app.get('/model/:id', modelController.get);
app.get('/model', modelController.list);
app.delete('/model/:id', modelController.remove);

app.post('/layer', layerController.save);
app.get('/layer/:id', layerController.get);
app.get('/layer', layerController.list);
app.delete('/layer/:id', layerController.remove);

app.post('/ani', animationController.save);
app.get('/ani/:id', animationController.get);
app.get('/ani', animationController.list);
app.delete('/ani/:id', animationController.remove);

function errorHandler(err, req, res, next) {
  console.log(err.stack);
  res.status(500);
  res.send('something went wrong');
};

app.use(errorHandler);

var port = 3001;
app.listen(port, function() {
  console.log('app listening on port ' + port);
});
