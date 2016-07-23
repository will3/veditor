var express = require('express');
var app = express();
var libPath = require('path');
var bodyParser = require('body-parser');
var Promise = require('bluebird');

Promise.promisifyAll(require('fs-extra'));

app.use(bodyParser.json());

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/textures', express.static('textures'));

app.get('/', function(req, res) {
  res.sendFile(libPath.join(__dirname, '/../index.html'));
});

app.post('/save', require('./controllers/savecontroller').save);
app.get('/list/:id', require('./controllers/listcontroller').get);
app.get('/list', require('./controllers/listcontroller').getList);
app.delete('/list/:id', require('./controllers/listcontroller').remove);

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
