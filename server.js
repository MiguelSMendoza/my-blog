'use strict';
var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var app = express();
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/blog');
app.use('/admin', express.static(__dirname + '/admin'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/vendor', express.static(__dirname + '/bower_components'));
var entrySchema = new mongoose.Schema({
	title: String,
	content: String,
	author: String,
	date: Number
});
var Entry = mongoose.model('Entry', entrySchema);
app.get('/', function(req, res) {
	res.sendFile('public/index.html', {
		root: __dirname
	});
});
app.get('/admin', function(req, res) {
	res.sendFile('admin/index.html', {
		root: __dirname
	});
});
app.post('/api/entries', function(req, res) {
	var body = req.body;
	var newEntry = new Entry({
		title: body.title,
		content: body.content,
		author: body.author,
		date: body.date
	});
	newEntry.save(function(err) {
		if (err) return handleError(err);
		res.json(newEntry);
	})
});
app.get('/api/entries', function(req, res) {
	Entry.find(function(err, entries) {
		if (err) return handleError(err);
		res.json(entries);
	});
});
var port = 8080;
app.listen(port, function() {
	console.log('Listening on port ' + port + '...');
});