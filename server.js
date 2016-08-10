'use strict';
var express = require('express');
var app = express();
app.get('/', function(req, res) {
	res.sendFile('public/index.html', { root: __dirname } );
});

app.use('/public', express.static(__dirname + '/public'));

var port = 8080;
app.listen(port, function() {
	console.log('Listening on port ' + port + '...');
});