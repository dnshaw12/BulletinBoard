const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
	member: {
		type: mongoose.Schema.Types.ObjectId,
    	ref: 'Member'
	},
	message: String
})

module.exports = mongoose.model('Request', requestSchema)