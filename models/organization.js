const mongoose = require('mongoose')
const Request  = require('../models/request');

const organizationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	// profilePic: file
	description: {
		type: String,
		required: true
	},
	requests: [Request.schema],
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Member'
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Organization', organizationSchema)