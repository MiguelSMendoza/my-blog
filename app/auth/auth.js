var mongoose = require('mongoose');  
var User = mongoose.model('User');
var bcrypt = require('bcrypt');
var service = require('./services');

module.exports.emailLogin = function(req, res) {  
	User.findOne({email: req.body.email.toLowerCase()}, function(err, user) {
		if(err || !user) {
			return res.status(401).send("Invalid Login");
		}
		bcrypt.compare(req.body.password, user.password, function(err, compare) {
		    if(compare) {
			    return res
					.status(200)
					.send({token: service.createToken(user)});
		    } else {
			    return res.status(401).send("Invalid Login");
		    }
		});
		
	});
}