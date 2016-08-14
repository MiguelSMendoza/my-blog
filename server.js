'use strict';
var express = require('express');
var app = express();
app.get('/', function(req, res) {
	res.sendFile('public/index.html', { root: __dirname } );
});

app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/vendor', express.static(__dirname + '/bower_components'));

var port = 8080;
app.listen(port, function() {
	console.log('Listening on port ' + port + '...');
});