'use strict';
var express = require('express');
var app = express();
app.get('/', function(req, res) {
	res.sendFile('public/index.html', {
		root: __dirname
	});
});
app.get('/news', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send({
		"news": [{
			"title": "Sample blog post",
			"content": "<p>This blog post shows a few different types of content that's supported and styled with Bootstrap. Basic typography, images, and code are all supported.</p>",
			"author": "Mark",
			"date": "1388595869"
		}, {
			"title": "New feature",
			"content": "<p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p><ul><li>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</li><li>Donec id elit non mi porta gravida at eget metus.</li><li>Nulla vitae elit libero, a pharetra augue.</li></ul><p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p><p>Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue.</p>",
			"author": "Chris",
			"date": "1387040669"
		}]
	});
});
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/vendor', express.static(__dirname + '/bower_components'));
var port = 8080;
app.listen(port, function() {
	console.log('Listening on port ' + port + '...');
});