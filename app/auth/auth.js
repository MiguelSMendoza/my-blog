var mongoose = require('mongoose');  
var User = mongoose.model('User');  
var service = require('./services');

module.exports.emailLogin = function(req, res) {  
	User.findOne({email: req.body.email.toLowerCase()}, function(err, user) {
		if(err || !user) {
			return res.status(401).send("Invalid Login");
		}
		
		return res
			.status(200)
			.send({token: service.createToken(user)});
	});
}