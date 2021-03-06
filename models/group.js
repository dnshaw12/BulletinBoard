const mongoose = require('mongoose')
const Request  = require('../models/request');

const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	profilePic: {
		data: Buffer,
		contentType: String
	},
	description: {
		type: String,
		required: true
	},
	requests: [Request.schema],
	private: Boolean,
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Member'
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Group', groupSchema)