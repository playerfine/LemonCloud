//INIT
var express = require("express");
	app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var session = require('client-sessions');

//ROUTES
var profileRoutes 	= 	require('./routes/profile.js');
var indexRoutes 	=  	require('./routes/index.js');

//Connect to DB
mongoose.connect("mongodb://localhost/socialmedia");

//models
var User = require('./models/users.js');

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	cookieName: "session", //define the name
	secret: "3a892395329982rs$@%frosaofios@$er3w9r9da$%%sbuadi3rin#@$#@epor2o52o3242o", //random String
	duration: 30 * 60 * 1000, //duration in milliseconds
	activeDuration: 5 * 60 * 1000, //prevent user to logout when he is active on the site
	httpOnly: true,
  	secure: true
}));


app.use(function(req, res, next) {
  if (req.session && req.session.user) {
		  User.findById(req.session.user._id, function(err, user) {
			if(user){
				req.user = user;
				delete req.user.password;
				req.session.user = user;
				res.locals.user = user;
			}
			next();
		});
	}else{
		next();
	}
});


app.use(function(req, res, next){
	res.locals.currentUser = req.session.user;
	res.locals.showProfileBanner = false;
	next();
});




app.use("/", profileRoutes);

app.use("/", indexRoutes);



app.listen(3000, function(){

	console.log("Your server is running");

});