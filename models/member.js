const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: String,
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	aboutMe: String,
	profilePic: {
		data: Buffer,
		contentType: String
	},
	signUpDate: Date,
	location: {
		addr1: String, 
		addr2: String, 
		city: String, 
		state: String, 
		zip: String

	},
	birthday: Date,
	createdDate: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Member', memberSchema);





