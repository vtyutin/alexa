var plex = require('./js/plex');
var sonybravia = require('./js/routes/sonybravia');
var tivo = require('./js/tivo');
var couchpotato = require('./js/couchpotato');

var express = require('express');
var http = require('http');
var app = express();

app.use('/plex', plex);
app.use('/sonybravia', sonybravia);
app.use('/tivo', tivo);
app.use('/cp', couchpotato);


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('API Homepage works');
});

http.createServer(app).listen(8181);
console.log('server running on port 8181');

