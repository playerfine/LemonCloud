var User = require('../models/users.js');
var middleware = {};


middleware.requireLogin = function(req, res, next){
	if(!req.user){
		res.redirect("/login"); 
	}else{
		next();
	}
};

middleware.alreadyLoggedIn = function(req, res, next){
	if(req.session && req.session.user){
		res.redirect("/index");
	}else{
		next();
	}
};

module.exports = middleware;
