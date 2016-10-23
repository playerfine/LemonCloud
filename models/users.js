var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: 			{type: String, required: true},
	username: 		{type: String, required: true},
	profilepicture: {type: String, default: "-"},
	password: 		{type: String, required: true},
	firstname: 		{type: String, default: "-"},
	lastname: 		{type: String, default: "-"},
	birthday: 		{type: Date,   default: 0-0-0},
	gender: 		{type: String, default: "Male"},
	created_at: 	{type: Date, default: Date.now} 
});

module.exports = mongoose.model("User", userSchema);