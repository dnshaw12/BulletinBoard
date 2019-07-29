const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
	member: {
		type: mongoose.Schema.Types.ObjectId,
    	ref: 'Member'
	},
	message: String,
	createdDate: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Request', requestSchema)