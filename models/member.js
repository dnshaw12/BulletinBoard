const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
	FirstName: String,
	LastName: String,
	Email: String,
	aboutMe: String,
	// profilePic: img file (multer)
	signUpDate: Date,
	Location: {
		addr1: String, 
		addr2: String, 
		city: String, 
		state: String, 
		zip: String

	},
	Birthday: Date
})

module.exports = mongoose.model('Member', memberSchema);





