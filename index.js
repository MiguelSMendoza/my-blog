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
var userSchema = new mongoose.Schema({
	email: String,
	password: String
});
var User = mongoose.model('User', userSchema);
app.get('/', function(req, res) {
	res.sendFile('public/index.html', {
		root: __dirname
	});
});
app.post('/auth/login', function(req, res) {  
    User.findOne({email: req.body.email.toLowerCase()}, function(err, user) {
    if(err || !user) {
	    return res.status(401).send("Invalid Login");
    }
    
    return res
        .status(200)
        .send({token: service.createToken(user)});
});
app.get('/admin', function(req, res) {
	res.sendFile('admin/index.html', {
		root: __dirname
	});
});
app.get('/admin/login', function(req, res) {
	res.sendFile('admin/login.html', {
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
	if(body.idEntry === 0) {
		newEntry.save(function(err) {
			if (err) return handleError(err);
			res.json(newEntry);
		});
	} else {
		var query = { '_id':body.idEntry };
		newEntry._id = body.idEntry;
		Entry.findOneAndUpdate(query, newEntry, {upsert:true}, function(err, doc){
		    if (err) return handleError(err);
		    return res.send(newEntry);
		});
	}
});
app.get('/api/entries', function(req, res) {
	Entry.find(function(err, entries) {
		if (err) return handleError(err);
		res.json(entries);
	});
});
app.get('/api/entries/:idEntry', function(req, res) {
	Entry.findById(req.params.idEntry, function (err, entry) { 
		if (err) return handleError(err);
		res.json(entry);
	});
});
var port = 8080;
app.listen(port, function() {
	console.log('Listening on port ' + port + '...');
});