const mongoose = require('mongoose');
const Request  = require('../models/request');


const eventSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	memberHost: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Member'
	},
	organizationHost: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Member'
	},
	beginDateTime: {
		type: Date,
		required: true
	},
	endDateTime:Date,
	requests: [Request.schema],
	description: {
		type: String,
		required: true
	},
	membersOnly: Boolean,
	attendeeMax: Number,
	location: {
		addr1: {
			type: String,
			required: true
		}, 
		addr2: String, 
		city: {
			type: String,
			required: true
		}, 
		state: {
			type: String,
			required: true
		}, 
		zip: {
			type: String,
			required: true
		},
		hasAlcohol: Boolean,
		createdDate: {
			type: Date,
			default: Date.now
		}
	},
})

module.exports = mongoose.model('Event', eventSchema);



