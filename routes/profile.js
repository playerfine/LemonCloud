var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/users.js');
var middleware = require('../middleware/index.js');

var busboy = require('connect-busboy');

var fs = require('fs');




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

router.get("/settings/upload", middleware.requireLogin, function(req, res){
	res.render('profile/profilePicture');
});

//make folder uploads
//encrypt file names
//upload them to DB with current user

router.post("/settings/upload", middleware.requireLogin, function(req, res){
    var fstream;
	//get current user logged in
	var usernameCurrentUser = req.session.user.username;
	req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

		//check if image is an jpg, jpeg or png file.
		 if(!filename.match(/\.(jpg|jpeg|png)$/)){
			 console.log("Please upload an image!");
			 res.redirect('back');
		 }else{
		 
			//crypt filename
			var filenames = bcrypt.hashSync(filename);
			//remove . + / from the crypted name
			var profilePicture = filenames.replace(/[/.]/g, 'n65');

			//save the file name in map called profilepictures
			fstream = fs.createWriteStream('public/profilepictures/' + profilePicture + '.png');
			file.pipe(fstream);
			fstream.on('close', function () {
				var newProfilePicture = {profilepicture: profilePicture};
				//find current user id and update their profile picture
				User.findByIdAndUpdate(req.session.user._id, newProfilePicture, function(err, data){
					//check for error
					if(err){
						console.log(err);
					}else{
						//redirect when finished
						res.redirect('/profile/' + usernameCurrentUser);
					}
				});
			});
		 }
    });
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