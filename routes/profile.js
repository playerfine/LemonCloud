var express = require('express');
var router = express.Router();
var User = require('../models/users.js');
var middleware = require('../middleware/index.js');



router.put("/settings", middleware.requireLogin, function(req, res){
	var newData = {email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname};

	User.findByIdAndUpdate(req.session.user._id, newData, function(err, data){
		if(err){
			console.log(err);
		}else{
			res.redirect("/settings");
		}
	});
});

router.get("/settings", middleware.requireLogin, function(req, res){
	res.render('profile/settings', {success_message: ""});
});


router.get("/profile/:username", function(req, res){;
		User.findOne({username: req.params.username}, function(err, foundUser){
		if(err){
				console.log("test");
		}else{

			// console.log(FoundUser.email);
			res.locals.showProfileBanner = true;


			res.render("profile/profile", {user: foundUser});
		}
	});
});

module.exports = router;