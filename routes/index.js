var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var User = require('../models/users.js');
var middleware = require('../middleware/index.js');

router.get("/", middleware.alreadyLoggedIn, function(req, res){
	res.render("landing");
});

router.get("/index", middleware.requireLogin, function(req, res){
	res.render("index", {username: req.session.user.username});
});



router.get("/login", middleware.alreadyLoggedIn, function(req, res){
	res.render("login", {error: ""});
});

router.post("/login", middleware.alreadyLoggedIn, function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	if(username === "" || password === ""){
		res.render("login", {error: "please fill in everything!"});
	}else{
		User.findOne({username: username}, function(err, user){
			if(!user){
				res.render("login", {error: "this username doesn't exist"});
			}else{
				if(bcrypt.compareSync(password, user.password)){
					req.session.user = user;
					res.redirect("/index");
				}else{
					res.render("login", {error: "password and username do not match!"});
				}
			}
		});
	}
});


router.get("/logout", function(req, res){
	req.session.reset();
	res.redirect("/login");
});

router.get("/register", middleware.alreadyLoggedIn, function(req, res){
	res.render("register", {error: ""});
});

router.post("/register", middleware.alreadyLoggedIn, function(req, res){
	var username = req.body.username;
	var password = bcrypt.hashSync(req.body.password);
	var email = req.body.email;
	if(username === "" || password === "" || email === ""){
		res.render("register", {error: "please fill in everything"});
	}else{
		User.findOne({username: username}, function(err, user){
			if(user){
				res.render("register", {error: "this username is already taken"});
			}else{
				User.findOne({email: email}, function(err, user){
					if(user){
						res.render("register", {error: "this e-mail is already taken"});
					}else{
						var newUser = {
							email: email,
							username: username,
							password: password
						};
						User.create(newUser, function(err, user){
							if(err){
								console.log(err);
							}else{
								
								req.session.user = user;
								res.redirect("/index");

							}
					 	});
					}
				});
			}
		});
	}
});

module.exports = router;