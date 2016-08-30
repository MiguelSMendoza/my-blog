'use strict';
require('dotenv').config();
var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var cors = require('cors'); 
var app = express();
var router = express.Router();
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
mongoose.connect(process.env.MONGODB_URI);
var middleware = require('./app/auth/middleware');
app.use('/admin', middleware.ensureAuthenticated, express.static(path.join(__dirname, '/admin')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));
app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use('/vendor', express.static(path.join(__dirname, '/bower_components')));
app.use(cors());  
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

/*bcrypt.hash('password', 5, function( err, bcryptedPassword) {
	if(err) handleError(err);
   var newUser = new User({
		email: "mail",
		password: bcryptedPassword
	});
	newUser.save(function(err) {
		console.log("Pollote");
	});
});*/

app.get('/', function(req, res) {
	res.sendFile('public/index.html', {
		root: __dirname
	});
});
var auth = require('./app/auth/auth');
app.post('/auth/login', auth.emailLogin);

router.get('/admin', middleware.ensureAuthenticated, function(req, res) {
	res.sendFile('admin/index.html', {
		root: __dirname
	});
});

app.get('/login', function(req, res) {
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
var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log('Listening on port ' + port + '...');
});